from datetime import datetime, timezone
from . import db

class UserDisqualification(db.Model):
    """
    UserDisqualification model representing user disqualifications.
    
    This model handles the storage and management of user disqualifications
    for rule violations, similar to yellow/red cards in soccer.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    reason = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    user = db.relationship('User', back_populates='disqualifications')

    def __repr__(self):
        return f'<UserDisqualification {self.id}>'

    def serialize(self):
        """
        Serialize the UserDisqualification object for API responses.
        
        Returns:
            dict: UserDisqualification data in JSON-serializable format
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'reason': self.reason,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } 