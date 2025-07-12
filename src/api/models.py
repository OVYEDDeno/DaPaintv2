from datetime import datetime, timedelta, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Numeric
from sqlalchemy.orm import backref
from flask import current_app
import string
import random
import secrets
from sqlalchemy.orm import validates
db = SQLAlchemy()


class User(db.Model):
    def generate_unique_id(self):
        """
        Generate a unique 11-character ID using uppercase letters, lowercase letters, and numbers
        """
        # Characters to use for ID generation
        chars = string.ascii_letters + string.digits
        
        # Generate a cryptographically secure random ID
        while True:
            new_id = ''.join(secrets.choice(chars) for _ in range(11))
            
            # Check if the ID is already in use
            existing = User.query.filter_by(id=new_id).first()
            if not existing:
                return new_id

    # Change id column to String type with 11 characters
    id = db.Column(db.String(11), primary_key=True, default=generate_unique_id)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    dapaint_unlocked = db.Column(db.Boolean, default=False, nullable=True)  # Free/Premium mode toggle
    name = db.Column(db.String(200), unique=True, nullable=False)
    city = db.Column(db.String(80), nullable=False)
    zipcode = db.Column(db.String(10), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    winstreak = db.Column(db.Integer, default=0)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    disqualifications = db.Column(db.Integer, default=0)
    disqualifications = db.relationship('UserDisqualification', back_populates='user')
    chat_streak = db.Column(db.Integer, default=0, nullable=True)  # Streak for the user

    # Social Media Links
    instagram_url = db.Column(db.String(200), nullable=True)
    tiktok_url = db.Column(db.String(200), nullable=True)
    twitch_url = db.Column(db.String(200), nullable=True)
    kick_url = db.Column(db.String(200), nullable=True)
    youtube_url = db.Column(db.String(200), nullable=True)
    twitter_url = db.Column(db.String(200), nullable=True)
    facebook_url = db.Column(db.String(200), nullable=True)
    password = db.Column(db.String(512), nullable=False)
    
    # Relationships for Admin
    admin_profile = db.relationship('Insight', back_populates='user', uselist=False, cascade='all, delete-orphan')

    # Profile pic relationship
    profile_pic = db.relationship("UserImg", back_populates="user", uselist=False, cascade='all, delete-orphan')

    orders = db.relationship("Orders", back_populates="user")
    tickets = db.relationship('Ticket', back_populates='user')

    # Notifications relationship
    notifications = db.relationship('Notifications', back_populates='user', cascade='all, delete-orphan')
    
     # Feedback relationship
    feedback = db.relationship('Feedback', back_populates='user', cascade='all, delete-orphan')
    chat = db.relationship('ChatMessages', back_populates='user', cascade='all, delete-orphan')
    ads = db.relationship('Ads', back_populates='user', cascade='all, delete-orphan')
    affiliate = db.relationship('Affiliate', back_populates='user', cascade='all, delete-orphan')

    # Other relationships
    reports = db.relationship('Reports', back_populates='user', uselist=False, cascade='all, delete-orphan')
    dapaint_host = db.relationship('DaPaint', foreign_keys='DaPaint.hostFoeId', back_populates='host_user', cascade='all, delete-orphan')
    dapaint_foe = db.relationship('DaPaint', foreign_keys='DaPaint.foeId', back_populates='foe_user', cascade='all, delete-orphan')
    dapaint_winner = db.relationship('DaPaint', foreign_keys='DaPaint.winnerId', back_populates='winner_user', cascade='all, delete-orphan')
    dapaint_loser = db.relationship('DaPaint', foreign_keys='DaPaint.loserId', back_populates='loser_user', cascade='all, delete-orphan')

    # Invite Code relationships
    invite_code = db.relationship('InviteCode', back_populates='inviter', uselist=False, cascade='all, delete-orphan')
    invited_by = db.relationship('InviteCode', back_populates='invitees', secondary='invitee_association', uselist=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def set_password(self, password):
        """
        Hash and set the user's password.
        
        Args:
            password (str): The plain text password to hash
        """
        from werkzeug.security import generate_password_hash
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """
        Check if the provided password matches the stored hash.
        
        Args:
            password (str): The plain text password to check
            
        Returns:
            bool: True if password matches, False otherwise
        """
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "dapaint_unlocked": self.dapaint_unlocked,
            "name": self.name,
            "city": self.city,
            "zipcode": self.zipcode,
            "phone": self.phone,
            "birthday": self.birthday.strftime("%m/%d/%Y"),
            "winstreak": self.winstreak,
            "wins": self.wins,
            "losses": self.losses,
            "disqualifications": self.disqualifications,
            "disqualifications": [dq.serialize() for dq in self.disqualifications],
            "profile_pic": self.profile_pic.serialize() if self.profile_pic else None,           
            "notifications": [n.serialize() for n in self.notifications],
            "instagram_url": self.instagram_url,
            "tiktok_url": self.tiktok_url,
            "twitch_url": self.twitch_url,
            "kick_url": self.kick_url,
            "youtube_url": self.youtube_url,
            "twitter_url": self.twitter_url,
            "facebook_url": self.facebook_url,
            "invite_code": self.invite_code.serialize() if self.invite_code else None,
            "invited_by": self.invited_by.serialize() if self.invited_by else None,
            "admin_profile": self.admin_profile.serialize() if self.admin_profile else None,
        }
        

class InviteCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), unique=True, nullable=False)
    inviter_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    used_btn = db.Column(db.Integer, nullable=True)
    total_left = db.Column(db.Integer, nullable=True)

    # Relationships
    inviter = db.relationship('User', back_populates='invite_code', uselist=False)
    invitees = db.relationship('User', secondary='invitee_association', back_populates='invited_by')

    def serialize(self):
        return {
            'id': self.id,
            'code': self.code,
            'inviter_id': self.inviter_id,
            'created_at': self.created_at.strftime("%m/%d/%Y %H:%M:%S"),
            'invitees': [invitee.id for invitee in self.invitees],
            'btn_count': self.used_btn,
            'total_left': self.total_left,
             'completed_dapaints': [
            {
                'invitee_id': invitee.id,
                'wins': invitee.wins,
                'losses': invitee.losses
            } 
            for invitee in self.invitees 
            if invitee.wins > 0 or invitee.losses > 0            
        ]
        }
        

invitee_association = db.Table('invitee_association',
    db.Column('invite_code_id', db.Integer, db.ForeignKey('invite_code.id'), primary_key=True),
    db.Column('invitee_id', db.String(11), db.ForeignKey('user.id'), primary_key=True),
    db.Column('used_at', db.DateTime, nullable=False, default=db.func.current_timestamp())
)
    

class DaPaint(db.Model):
    __tablename__ = 'dapaint'
    def generate_unique_id(self):
        """
        Generate a unique 12-character ID using uppercase letters, lowercase letters, and numbers
        """
        # Characters to use for ID generation
        chars = string.ascii_letters + string.digits
        
        # Generate a cryptographically secure random ID
        while True:
            new_id = ''.join(secrets.choice(chars) for _ in range(12))
            
            # Check if the ID is already in use
            existing = DaPaint.query.filter_by(id=new_id).first()
            if not existing:
                return new_id

    # Change id column to String type with 12 characters
    id = db.Column(db.String(12), primary_key=True, default=generate_unique_id)

    hostFoeId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)  # Host user
    foeId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)  # Foe user
    created_at = db.Column(db.DateTime(timezone=False), nullable=True, default=lambda: datetime.now(timezone.utc))

    fitnessStyle = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    date_time = db.Column(db.DateTime(timezone=False), nullable=False)
    price = db.Column(db.Integer, nullable=False, default=1)
    winnerId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    loserId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    isBoosted = db.Column(db.Boolean, nullable=True)

    # Host user results
    host_winnerId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    host_loserId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    host_winnerImg = db.Column(db.String(250), nullable=True)

    # Foe user results
    foe_winnerId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    foe_loserId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    foe_winnerImg = db.Column(db.String(250), nullable=True)

    # Relationships for host and foe
    host_user = db.relationship('User', foreign_keys=[hostFoeId], back_populates='dapaint_host')
    foe_user = db.relationship('User', foreign_keys=[foeId], back_populates='dapaint_foe')
    winner_user = db.relationship('User', foreign_keys=[winnerId], back_populates='dapaint_winner')
    loser_user = db.relationship('User', foreign_keys=[loserId], back_populates='dapaint_loser')

    # Reports handling
    reports = db.relationship('Reports', back_populates='dapaint', cascade='all, delete-orphan')
    lastmodify = db.Column(db.String(11), db.ForeignKey('user.id'), unique=True, nullable=True)

    # Dispute tracking
    dispute_status = db.Column(db.String(50), nullable=True)  # e.g., 'pending', 'resolved'
    dispute_reported = db.Column(db.Boolean, default=False)

    # Relationship with tickets (single relationship definition)
    tickets = db.relationship('Ticket', back_populates='dapaint')

    def serialize(self):
        return {
            "id": self.id,
            "hostFoeId": self.host_user.serialize(),
            "foeId": self.foe_user.serialize() if self.foe_user else "N/A",
            "created_at": self.created_at.strftime("%m/%d/%Y %H:%M:%S"),
            "fitnessStyle": self.fitnessStyle,
            "location": self.location,
            "date_time": self.date_time.strftime("%m/%d/%Y %H:%M:%S"),
            "price": self.price,
            "host_winnerId": self.host_winnerId,
            "host_loserId": self.host_loserId,
            "host_winnerImg": self.host_winnerImg,
            "foe_winnerId": self.foe_winnerId,
            "foe_loserId": self.foe_loserId,
            "foe_winnerImg": self.foe_winnerImg,
            "winnerId": self.winnerId,
            "loserId": self.loserId,
            "dispute_status": self.dispute_status,
            "dispute_reported": self.dispute_reported,
            "tickets": [ticket.serialize() for ticket in self.tickets]
        }

class UserImg(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(500), nullable=False, unique=True)
    image_url = db.Column(db.String(500), nullable=False, unique=True)
    user_id = db.Column(db.String(11), db.ForeignKey("user.id"), nullable=False, unique=True)
    user = db.relationship("User", back_populates="profile_pic", uselist=False)

    def __init__(self, public_id, image_url, user_id):
        self.public_id = public_id
        self.image_url = image_url.strip()
        self.user_id = user_id

    def serialize(self):
        return {
            "id": self.id,
            "image_url": self.image_url
        }
    

class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='notifications')

    def delete_expired(self):
        expiry_date = datetime.now(timezone.utc) - timedelta(hours=24)
        if self.created_at < expiry_date:
            db.session.delete(self)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'message': self.message,
            'created_at': self.created_at.strftime("%m/%d/%Y %H:%M:%S")
        }

class Reports(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    dapaint_id = db.Column(db.String(12), db.ForeignKey('dapaint.id'), nullable=False)  # Corrected foreign key reference
    host_winnerImg = db.Column(db.String(500),  nullable=False) 
    foe_winnerImg = db.Column(db.String(500), nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    resolved = db.Column(db.Boolean, default=False)
    resolved_at = db.Column(db.DateTime, nullable=True)

    # Relationships with explicit foreign_keys to resolve ambiguity
    dapaint = db.relationship('DaPaint', back_populates='reports', foreign_keys=[dapaint_id])
    user = db.relationship('User', back_populates='reports')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'dapaint_id': self.dapaint_id,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'resolved': self.resolved,
            'resolved_at': self.resolved_at.strftime("%Y-%m-%d %H:%M:%S") if self.resolved else None
        }
    
class DonePaints(db.Model):
    __tablename__ = 'donepaints'
    id = db.Column(db.Integer, primary_key=True)
    winnerId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)  # Changed to user.id
    loserId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)   # Changed to user.id
    host_winnerImg = db.Column(db.String(500), nullable=True)
    foe_winnerImg = db.Column(db.String(500), nullable=True)
    finalized_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationships
    winner = db.relationship('User', foreign_keys=[winnerId])  # Changed to User
    loser = db.relationship('User', foreign_keys=[loserId])    # Changed to User

    def serialize(self):
        return {
            'id': self.id,
            'finalized_at': self.finalized_at.strftime("%Y-%m-%d %H:%M:%S") if self.finalized_at else None
        }


class UserDisqualification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    reason = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    user = db.relationship('User', back_populates='disqualifications')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'reason': self.reason,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

class Insight(db.Model):
    __tablename__ = 'insight' 
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    
    is_active = db.Column(db.Boolean(), nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationship back to User
    user = db.relationship('User', back_populates='admin_profile')

    # Admin statistics fields
    total_users = db.Column(db.Integer, default=0)
    daily_active_users = db.Column(db.Integer, default=0)
    winstreak_winners = db.Column(db.Integer, default=0)
    most_popular_sport = db.Column(db.String(50), nullable=True)
    sports_market_percentage = db.Column(db.Float, default=0.0)
    matches_per_day = db.Column(db.Integer, default=0)
    inactive_users = db.Column(db.Integer, default=0)

    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "is_active": self.is_active,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "total_users": self.total_users,
            "daily_active_users": self.daily_active_users,
            "winstreak_winners": self.winstreak_winners,
            "most_popular_sport": self.most_popular_sport,
            "sports_market_percentage": self.sports_market_percentage,
            "matches_per_day": self.matches_per_day,
            "inactive_users": self.inactive_users
        }



class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="orders")
    paypal_id = db.Column(db.String(500), unique=True)
    tickets = db.relationship('Ticket', backref='order', lazy=True)
    type_of_order = db.Column(db.String(20))
    fulfilled = db.Column(db.Boolean, default=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "paypal_id": self.paypal_id,
            "type_of_order": self.type_of_order,
            "fulfilled": self.fulfilled
        }

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    dapaint_id = db.Column(db.String(12), db.ForeignKey('dapaint.id'), nullable=False)
    already_scanned = db.Column(db.Boolean, default=False)
    ticket_code = db.Column(db.String(255), unique=True, nullable=False)
    qr_code_path = db.Column(db.String(2048), nullable=True)

    user = db.relationship('User', back_populates='tickets')
    dapaint = db.relationship('DaPaint', back_populates='tickets')

    def serialize(self):
        return {
            'id': self.id,
            'dapaint_id': self.dapaint_id,
            'user_id': self.user_id,
            'already_scanned': self.already_scanned,
            'ticket_code': self.ticket_code,
            'qr_code_path': self.qr_code_path,
            'dapaint': self.dapaint.serialize(),            
        }

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    user_email = db.Column(db.String(120), db.ForeignKey('user.email'), nullable=False)
    feedback_text = db.Column(db.String(500), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationship to User model
    user = db.relationship('User', back_populates='feedback')
    
    def serialize(self):
        return {
            'id': self.id,
            'user_email': self.user_email,
            'feedback_text': self.feedback_text,
            'rating': self.rating,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
class ChatMessages(db.Model):
    __tablename__ = 'ChatMessages'
    id = db.Column(db.Integer, primary_key=True)    
    name = db.Column(db.String(200), db.ForeignKey('user.name'), nullable=False)
    chat_text = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationship to User model
    user = db.relationship('User', back_populates='chat')
    
    def serialize(self):
        return {
            'id': self.id,
            "name": self.name,
            'chat_text': self.chat_text,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
class BanList(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    chat_text = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    ban_duration = db.Column(db.Integer, nullable=True, default=30)  # Optional timeout for the chat message
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'chat_text': self.chat_text,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
    
class Ads(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='ads')  
    adTitle = db.Column(db.String(500), nullable=False)  # e.g., "Basketball Shoes Sale"
    age = db.Column(db.ARRAY(db.String), nullable=True)  # e.g., 18-25
    audience = db.Column(db.String(50), nullable=False, default='everyone')
    keywords = db.Column(db.ARRAY(db.String), nullable=True)  # e.g., ["basketball", "shoes"]
    zipcodes = db.Column(db.ARRAY(db.String), nullable=True)  # e.g., ["12345", "67890"]
    start_date = db.Column(db.Date, nullable=False)
    daily_spending_limit = db.Column(Numeric(10, 2), default=0.01)
    available_funds = db.Column(Numeric(10, 2), default=0.00)
    active = db.Column(db.Boolean, default=True)
    views = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    src= db.Column(db.String(500), nullable=False)  # Image source URL
    alt= db.Column(db.String(500), nullable=False)  # Image source URL
    href= db.Column(db.String(500), nullable=False)  # Link to advertiser's site
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'adTitle': self.adTitle,
            'age': self.age,
            'keywords': self.keywords,
            'zipcodes': self.zipcodes,
            'start_date': self.start_date.strftime("%Y-%m-%d"),
            'active': self.active,
            'views': self.views,
            'clicks': self.clicks,
            'src': self.src,
            'alt': self.alt,
            'href': self.href,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'updated_at': self.updated_at.strftime("%Y-%m-%d %H:%M:%S")
        }
class Affiliate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='affiliate')  
    views = db.Column(db.Integer, default=0)  # Total Impressions (not unique)
    clicks = db.Column(db.Integer, default=0)
    src = db.Column(db.String(500), nullable=False)
    href = db.Column(db.String(500), nullable=False)
    last_shown = db.Column(db.DateTime, nullable=True)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'views': self.views,
            'clicks': self.clicks,
            'src': self.src,
            'href': self.href,
            'last_shown': self.last_shown.isoformat() if self.last_shown else None
        }
class AffiliateView(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    ad_id = db.Column(db.Integer, db.ForeignKey('affiliate.id'), nullable=False)
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)  # To support time-based queries


