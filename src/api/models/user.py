from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import validates
import string
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    """
    User model representing registered users in the DaPaint application.
    
    This model handles user authentication, profile information, and relationships
    to other entities like DaPaint matches, notifications, and social media links.
    """
    
    def generate_unique_id(self):
        """
        Generate a unique 11-character ID using uppercase letters, lowercase letters, and numbers.
        
        Returns:
            str: A unique 11-character alphanumeric ID
        """
        chars = string.ascii_letters + string.digits
        
        while True:
            new_id = ''.join(secrets.choice(chars) for _ in range(11))
            existing = User.query.filter_by(id=new_id).first()
            if not existing:
                return new_id

    # Primary identification
    id = db.Column(db.String(11), primary_key=True, default=generate_unique_id)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    
    # Account status
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    dapaint_unlocked = db.Column(db.Boolean, default=False, nullable=True)  # Free/Premium mode toggle
    
    # Personal information
    city = db.Column(db.String(80), nullable=False)
    zipcode = db.Column(db.String(10), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    
    # Game statistics
    winstreak = db.Column(db.Integer, default=0)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    disqualifications = db.Column(db.Integer, default=0)
    chat_streak = db.Column(db.Integer, default=0, nullable=True)
    
    # Social Media Links
    instagram_url = db.Column(db.String(200), nullable=True)
    tiktok_url = db.Column(db.String(200), nullable=True)
    twitch_url = db.Column(db.String(200), nullable=True)
    kick_url = db.Column(db.String(200), nullable=True)
    youtube_url = db.Column(db.String(200), nullable=True)
    twitter_url = db.Column(db.String(200), nullable=True)
    facebook_url = db.Column(db.String(200), nullable=True)
    
    # Relationships
    admin_profile = db.relationship('Insight', back_populates='user', uselist=False, cascade='all, delete-orphan')
    profile_pic = db.relationship("UserImg", back_populates="user", uselist=False, cascade='all, delete-orphan')
    orders = db.relationship("Orders", back_populates="user")
    tickets = db.relationship('Ticket', back_populates='user')
    notifications = db.relationship('Notifications', back_populates='user', cascade='all, delete-orphan')
    feedback = db.relationship('Feedback', back_populates='user', cascade='all, delete-orphan')
    chat = db.relationship('ChatMessages', back_populates='user', cascade='all, delete-orphan')
    ads = db.relationship('Ads', back_populates='user', cascade='all, delete-orphan')
    affiliate = db.relationship('Affiliate', back_populates='user', cascade='all, delete-orphan')
    reports = db.relationship('Reports', back_populates='user', uselist=False, cascade='all, delete-orphan')
    disqualifications = db.relationship('UserDisqualification', back_populates='user')
    
    # DaPaint relationships
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
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """
        Check if the provided password matches the stored hash.
        
        Args:
            password (str): The plain text password to check
            
        Returns:
            bool: True if password matches, False otherwise
        """
        return check_password_hash(self.password, password)

    @validates('email')
    def validate_email(self, key, email):
        """Validate email format."""
        if not email or '@' not in email:
            raise ValueError('Invalid email address')
        return email.lower()

    @validates('phone')
    def validate_phone(self, key, phone):
        """Validate phone number format (10 digits)."""
        if not phone or not phone.isdigit() or len(phone) != 10:
            raise ValueError('Phone number must be exactly 10 digits')
        return phone

    @validates('zipcode')
    def validate_zipcode(self, key, zipcode):
        """Validate zipcode format (5 digits)."""
        if not zipcode or not zipcode.isdigit() or len(zipcode) != 5:
            raise ValueError('Zipcode must be exactly 5 digits')
        return zipcode

    def serialize(self):
        """
        Serialize the user object for API responses.
        
        Returns:
            dict: User data in JSON-serializable format
        """
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