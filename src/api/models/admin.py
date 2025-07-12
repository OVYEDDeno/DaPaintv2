from datetime import datetime, timezone
from . import db

class Insight(db.Model):
    """
    Insight model representing admin statistics and platform insights.
    
    This model handles the storage and management of platform statistics
    for administrative purposes and analytics.
    """
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

    def __repr__(self):
        return f'<Insight {self.id}>'

    def serialize(self):
        """
        Serialize the Insight object for API responses.
        
        Returns:
            dict: Insight data in JSON-serializable format
        """
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