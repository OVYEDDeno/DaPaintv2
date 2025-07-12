from . import db

class UserImg(db.Model):
    """
    UserImg model representing user profile pictures.
    
    This model handles the storage and management of user profile images
    with Cloudinary integration.
    """
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(500), nullable=False, unique=True)
    image_url = db.Column(db.String(500), nullable=False, unique=True)
    user_id = db.Column(db.String(11), db.ForeignKey("user.id"), nullable=False, unique=True)
    user = db.relationship("User", back_populates="profile_pic", uselist=False)

    def __init__(self, public_id, image_url, user_id):
        self.public_id = public_id
        self.image_url = image_url.strip()
        self.user_id = user_id

    def __repr__(self):
        return f'<UserImg {self.user_id}>'

    def serialize(self):
        """
        Serialize the UserImg object for API responses.
        
        Returns:
            dict: UserImg data in JSON-serializable format
        """
        return {
            "id": self.id,
            "image_url": self.image_url
        } 