from datetime import datetime, timezone
from sqlalchemy import Column, Numeric
from . import db

class Ads(db.Model):
    """
    Ads model representing user-created advertisements.
    
    This model handles the storage and management of user advertisements
    with targeting options and performance tracking.
    """
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
    src = db.Column(db.String(500), nullable=False)  # Image source URL
    alt = db.Column(db.String(500), nullable=False)  # Image alt text
    href = db.Column(db.String(500), nullable=False)  # Link to advertiser's site
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Ads {self.id}>'

    def serialize(self):
        """
        Serialize the Ads object for API responses.
        
        Returns:
            dict: Ads data in JSON-serializable format
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'adTitle': self.adTitle,
            'age': self.age,
            'audience': self.audience,
            'keywords': self.keywords,
            'zipcodes': self.zipcodes,
            'start_date': self.start_date.strftime("%Y-%m-%d") if self.start_date else None,
            'daily_spending_limit': float(self.daily_spending_limit) if self.daily_spending_limit else 0.0,
            'available_funds': float(self.available_funds) if self.available_funds else 0.0,
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
    """
    Affiliate model representing affiliate marketing links.
    
    This model handles the storage and management of affiliate marketing
    links and their performance tracking.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='affiliate')  
    views = db.Column(db.Integer, default=0)  # Total Impressions (not unique)
    clicks = db.Column(db.Integer, default=0)
    src = db.Column(db.String(500), nullable=False)
    href = db.Column(db.String(500), nullable=False)
    last_shown = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Affiliate {self.id}>'

    def serialize(self):
        """
        Serialize the Affiliate object for API responses.
        
        Returns:
            dict: Affiliate data in JSON-serializable format
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'views': self.views,
            'clicks': self.clicks,
            'src': self.src,
            'href': self.href,
            'last_shown': self.last_shown.strftime("%Y-%m-%d %H:%M:%S") if self.last_shown else None
        }


class AffiliateView(db.Model):
    """
    AffiliateView model representing individual affiliate link views.
    
    This model tracks individual views of affiliate links for detailed
    analytics and time-based queries.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    ad_id = db.Column(db.Integer, db.ForeignKey('affiliate.id'), nullable=False)
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)  # To support time-based queries

    def __repr__(self):
        return f'<AffiliateView {self.id}>' 