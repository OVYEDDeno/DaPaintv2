from datetime import datetime, timezone
from . import db

class Reports(db.Model):
    """
    Reports model representing match dispute reports.
    
    This model handles the storage and management of user reports
    for disputed match results.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    dapaint_id = db.Column(db.String(12), db.ForeignKey('dapaint.id'), nullable=False)
    host_winnerImg = db.Column(db.String(500), nullable=False) 
    foe_winnerImg = db.Column(db.String(500), nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    resolved = db.Column(db.Boolean, default=False)
    resolved_at = db.Column(db.DateTime, nullable=True)

    # Relationships with explicit foreign_keys to resolve ambiguity
    dapaint = db.relationship('DaPaint', back_populates='reports', foreign_keys=[dapaint_id])
    user = db.relationship('User', back_populates='reports')

    def __repr__(self):
        return f'<Reports {self.id}>'

    def serialize(self):
        """
        Serialize the Reports object for API responses.
        
        Returns:
            dict: Reports data in JSON-serializable format
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'dapaint_id': self.dapaint_id,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'resolved': self.resolved,
            'resolved_at': self.resolved_at.strftime("%Y-%m-%d %H:%M:%S") if self.resolved else None
        } 