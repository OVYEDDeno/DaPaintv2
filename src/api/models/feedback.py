from datetime import datetime, timezone
from . import db

class Feedback(db.Model):
    """
    Feedback model representing user feedback and ratings.
    
    This model handles the storage and management of user feedback
    and ratings for the platform.
    """
    id = db.Column(db.Integer, primary_key=True)    
    user_email = db.Column(db.String(120), db.ForeignKey('user.email'), nullable=False)
    feedback_text = db.Column(db.String(500), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationship to User model
    user = db.relationship('User', back_populates='feedback')
    
    def __repr__(self):
        return f'<Feedback {self.id}>'

    def serialize(self):
        """
        Serialize the Feedback object for API responses.
        
        Returns:
            dict: Feedback data in JSON-serializable format
        """
        return {
            'id': self.id,
            'user_email': self.user_email,
            'feedback_text': self.feedback_text,
            'rating': self.rating,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } 