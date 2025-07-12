from datetime import datetime, timezone
from . import db

class ChatMessages(db.Model):
    """
    ChatMessages model representing user chat messages.
    
    This model handles the storage and management of user chat messages
    in the platform's chat system.
    """
    __tablename__ = 'ChatMessages'
    
    id = db.Column(db.Integer, primary_key=True)    
    name = db.Column(db.String(200), db.ForeignKey('user.name'), nullable=False)
    chat_text = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationship to User model
    user = db.relationship('User', back_populates='chat')
    
    def __repr__(self):
        return f'<ChatMessages {self.id}>'

    def serialize(self):
        """
        Serialize the ChatMessages object for API responses.
        
        Returns:
            dict: ChatMessages data in JSON-serializable format
        """
        return {
            'id': self.id,
            "name": self.name,
            'chat_text': self.chat_text,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }


class BanList(db.Model):
    """
    BanList model representing banned chat messages and users.
    
    This model handles the storage and management of banned chat content
    and user timeouts for moderation purposes.
    """
    id = db.Column(db.Integer, primary_key=True)    
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    chat_text = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    ban_duration = db.Column(db.Integer, nullable=True, default=30)  # Optional timeout for the chat message
    
    def __repr__(self):
        return f'<BanList {self.id}>'

    def serialize(self):
        """
        Serialize the BanList object for API responses.
        
        Returns:
            dict: BanList data in JSON-serializable format
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'chat_text': self.chat_text,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } 