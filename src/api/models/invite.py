from datetime import datetime
from . import db

class InviteCode(db.Model):
    """
    InviteCode model representing invitation codes for user registration.
    
    This model handles the invitation system where users can invite others
    to join the platform using unique codes.
    """
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), unique=True, nullable=False)
    inviter_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    used_btn = db.Column(db.Integer, nullable=True)
    total_left = db.Column(db.Integer, nullable=True)

    # Relationships
    inviter = db.relationship('User', back_populates='invite_code', uselist=False)
    invitees = db.relationship('User', secondary='invitee_association', back_populates='invited_by')

    def __repr__(self):
        return f'<InviteCode {self.code}>'

    def serialize(self):
        """
        Serialize the InviteCode object for API responses.
        
        Returns:
            dict: InviteCode data in JSON-serializable format
        """
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


# Association table for many-to-many relationship between InviteCode and User
invitee_association = db.Table('invitee_association',
    db.Column('invite_code_id', db.Integer, db.ForeignKey('invite_code.id'), primary_key=True),
    db.Column('invitee_id', db.String(11), db.ForeignKey('user.id'), primary_key=True),
    db.Column('used_at', db.DateTime, nullable=False, default=db.func.current_timestamp())
) 