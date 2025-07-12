from datetime import datetime, timedelta, timezone
from . import db

class Notifications(db.Model):
    """
    Notifications model representing user notifications.
    
    This model handles the storage and management of user notifications
    with automatic expiration after 24 hours.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='notifications')

    def __repr__(self):
        return f'<Notifications {self.id}>'

    def delete_expired(self):
        """
        Delete notifications that are older than 24 hours.
        """
        expiry_date = datetime.now(timezone.utc) - timedelta(hours=24)
        if self.created_at < expiry_date:
            db.session.delete(self)

    def serialize(self):
        """
        Serialize the Notifications object for API responses.
        
        Returns:
            dict: Notifications data in JSON-serializable format
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'message': self.message,
            'created_at': self.created_at.strftime("%m/%d/%Y %H:%M:%S")
        } 