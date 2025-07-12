from datetime import datetime, timezone
import string
import secrets
from . import db

class DaPaint(db.Model):
    """
    DaPaint model representing competitive matches between users.
    
    This model handles match creation, participant management, and result tracking
    for the competitive fitness platform.
    """
    __tablename__ = 'dapaint'
    
    def generate_unique_id(self):
        """
        Generate a unique 12-character ID using uppercase letters, lowercase letters, and numbers.
        
        Returns:
            str: A unique 12-character alphanumeric ID
        """
        chars = string.ascii_letters + string.digits
        
        while True:
            new_id = ''.join(secrets.choice(chars) for _ in range(12))
            existing = DaPaint.query.filter_by(id=new_id).first()
            if not existing:
                return new_id

    # Primary identification
    id = db.Column(db.String(12), primary_key=True, default=generate_unique_id)
    created_at = db.Column(db.DateTime(timezone=False), nullable=True, default=lambda: datetime.now(timezone.utc))

    # Participants
    hostFoeId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)  # Host user
    foeId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)  # Foe user
    
    # Match details
    fitnessStyle = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    date_time = db.Column(db.DateTime(timezone=False), nullable=False)
    price = db.Column(db.Integer, nullable=False, default=1)
    isBoosted = db.Column(db.Boolean, nullable=True)
    
    # Results
    winnerId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    loserId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    
    # Host user results
    host_winnerId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    host_loserId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    host_winnerImg = db.Column(db.String(250), nullable=True)

    # Foe user results
    foe_winnerId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    foe_loserId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    foe_winnerImg = db.Column(db.String(250), nullable=True)

    # Dispute tracking
    dispute_status = db.Column(db.String(50), nullable=True)  # e.g., 'pending', 'resolved'
    dispute_reported = db.Column(db.Boolean, default=False)
    lastmodify = db.Column(db.String(11), db.ForeignKey('user.id'), unique=True, nullable=True)

    # Relationships
    host_user = db.relationship('User', foreign_keys=[hostFoeId], back_populates='dapaint_host')
    foe_user = db.relationship('User', foreign_keys=[foeId], back_populates='dapaint_foe')
    winner_user = db.relationship('User', foreign_keys=[winnerId], back_populates='dapaint_winner')
    loser_user = db.relationship('User', foreign_keys=[loserId], back_populates='dapaint_loser')
    
    # Related entities
    reports = db.relationship('Reports', back_populates='dapaint', cascade='all, delete-orphan')
    tickets = db.relationship('Ticket', back_populates='dapaint')

    def __repr__(self):
        return f'<DaPaint {self.id}>'

    def serialize(self):
        """
        Serialize the DaPaint object for API responses.
        
        Returns:
            dict: DaPaint data in JSON-serializable format
        """
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


class DonePaints(db.Model):
    """
    DonePaints model representing completed matches that have been archived.
    
    This model stores historical match data after matches are completed and
    moved from the active DaPaint table.
    """
    __tablename__ = 'donepaints'
    
    id = db.Column(db.Integer, primary_key=True)
    winnerId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    loserId = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=True)
    host_winnerImg = db.Column(db.String(500), nullable=True)
    foe_winnerImg = db.Column(db.String(500), nullable=True)
    finalized_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationships
    winner = db.relationship('User', foreign_keys=[winnerId])
    loser = db.relationship('User', foreign_keys=[loserId])

    def __repr__(self):
        return f'<DonePaints {self.id}>'

    def serialize(self):
        """
        Serialize the DonePaints object for API responses.
        
        Returns:
            dict: DonePaints data in JSON-serializable format
        """
        return {
            'id': self.id,
            'finalized_at': self.finalized_at.strftime("%Y-%m-%d %H:%M:%S") if self.finalized_at else None
        } 