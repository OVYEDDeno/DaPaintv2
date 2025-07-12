from flask_sqlalchemy import SQLAlchemy

# Create the database instance
db = SQLAlchemy()

# Import all models to ensure they are registered with SQLAlchemy
from .user import User
from .dapaint import DaPaint, DonePaints
from .invite import InviteCode, invitee_association
from .media import UserImg
from .notifications import Notifications
from .reports import Reports
from .disqualifications import UserDisqualification
from .admin import Insight
from .orders import Orders, Ticket
from .feedback import Feedback
from .chat import ChatMessages, BanList
from .ads import Ads, Affiliate, AffiliateView

# Export all models
__all__ = [
    'db',
    'User',
    'DaPaint', 
    'DonePaints',
    'InviteCode',
    'invitee_association',
    'UserImg',
    'Notifications',
    'Reports',
    'UserDisqualification',
    'Insight',
    'Orders',
    'Ticket',
    'Feedback',
    'ChatMessages',
    'BanList',
    'Ads',
    'Affiliate',
    'AffiliateView'
] 