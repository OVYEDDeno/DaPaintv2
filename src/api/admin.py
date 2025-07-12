import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, User, DaPaint, UserImg, Reports, DonePaints, InviteCode, Ticket, Orders, Notifications, Insight, UserDisqualification, Feedback, ChatMessages, BanList, Ads, Affiliate

class CustomModelView(ModelView):
    """Base custom model view with ID column"""
    column_display_pk = True

class UserView(CustomModelView):
    column_list = ('id', 'email', 'name', 'zipcode', 'city', 'phone', 'dapaint_unlocked', 'winstreak', 'wins', 'losses',  'password')
    column_searchable_list = ['email', 'name', 'id', 'city']
    column_filters = ['is_active', 'dapaint_unlocked', 'city', 'zipcode', 'phone', 'winstreak', 'wins', 'losses']

class DaPaintView(CustomModelView):
    column_list = ('id', 'hostFoeId', 'foeId', 'winnerId', 'loserId', 'fitnessStyle', 'location', 'date_time', 'price', "created_at", 'dispute_status')
    column_searchable_list = ['fitnessStyle', 'location']
    column_filters = ['dispute_status', 'date_time', 'price']

class UserImgView(CustomModelView):
    column_list = ('id', 'user_id', 'public_id', 'image_url')
    column_filters = ['user_id']

class ReportsView(ModelView):
    column_list = ['id', 'user_id', 'dapaint_id', 'host_winnerImg', 'foe_winnerImg', 'created_at', 'resolved', 'resolved_at']
    column_searchable_list = ['id', 'user_id', 'dapaint_id']
    column_filters = ['resolved']

class DonePaintsView(ModelView):
    column_list = ['id', 'winnerId', 'loserId','host_winnerImg', 'foe_winnerImg', 'finalized_at']
    column_searchable_list = ['id', 'winnerId', 'loserId']
    column_filters = ['id', 'finalized_at', 'winnerId', 'loserId']

class InviteCodeView(CustomModelView):
    column_list = ('id', 'code', 'inviter_id', 'created_at')
    column_searchable_list = ['code']
    column_filters = ['created_at']

class TicketView(CustomModelView):
    column_list = ('id', 'user_id', 'order_id', 'dapaint_id', 'already_scanned', 'ticket_code')
    column_searchable_list = ['ticket_code']
    column_filters = ['already_scanned']

class OrdersView(CustomModelView):
    column_list = ('id', 'user_id', 'paypal_id', 'type_of_order', 'fulfilled')
    column_filters = ['fulfilled', 'type_of_order']

class NotificationsView(CustomModelView):
    column_list = ('id', 'user_id', 'type', 'message', 'created_at')
    column_searchable_list = ['message']
    column_filters = ['type', 'created_at']

class InsightView(CustomModelView):
    column_list = ('id', 'user_id', 'is_active', 'total_users', 'daily_active_users', 'winstreak_winners', 'most_popular_sport')
    column_filters = ['is_active']

class UserDisqualificationView(CustomModelView):
    column_list = ('id', 'user_id', 'reason', 'created_at')
    column_searchable_list = ['reason']
    column_filters = ['created_at']

class FeedbackView(CustomModelView):
    column_list = ('id', 'user_email', 'feedback_text', 'rating', 'created_at')
    column_searchable_list = ['feedback_text']
    column_filters = ['rating', 'created_at']

class ChatView(CustomModelView):
    column_list = ('id', 'name', 'chat_text', 'created_at')
    column_searchable_list = ['chat_text']
    column_filters = ['created_at']
class AdsView(CustomModelView):
    column_list = ('id', 'user_id', 'adTitle', 'audience', 'active', 'views', 'clicks')
    column_searchable_list = ['adTitle', 'audience', 'keywords', 'zipcodes']
    column_filters = ['start_date', 'active', 'audience']
    column_labels = {
        'id': 'Ad ID',
        'user_id': 'User ID',
        'adTitle': 'Ad Title',
        'audience': 'Target Audience',
        'active': 'Active Status',
        'views': 'Views',
        'clicks': 'Clicks',
    }


class AffiliateView(CustomModelView):
    column_list = ('id', 'user_id', 'views', 'clicks', 'src', 'href', 'last_shown')
    column_searchable_list = ['src', 'href']
    column_filters = ['last_shown']
    column_labels = {
        'id': 'Affiliate ID',
        'user_id': 'User ID',
        'views': 'Total Views',
        'clicks': 'Total Clicks',
        'src': 'Image Source URL',
        'href': 'Redirect URL',
        'last_shown': 'Last Shown Time',
    }

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='DaPaint Admin', template_mode='bootstrap3')

    # Add views with custom ModelView classes
    admin.add_view(UserView(User, db.session))
    admin.add_view(DaPaintView(DaPaint, db.session))
    admin.add_view(InviteCodeView(InviteCode, db.session))
    admin.add_view(TicketView(Ticket, db.session))
    admin.add_view(UserImgView(UserImg, db.session))
    admin.add_view(ReportsView(Reports, db.session))
    admin.add_view(DonePaintsView(DonePaints, db.session))
    admin.add_view(NotificationsView(Notifications, db.session))
    admin.add_view(InsightView(Insight, db.session))
    admin.add_view(OrdersView(Orders, db.session))
    admin.add_view(UserDisqualificationView(UserDisqualification, db.session))
    admin.add_view(FeedbackView(Feedback, db.session))
    admin.add_view(ChatView(ChatMessages, db.session))
    admin.add_view(AdsView(Ads, db.session))
    admin.add_view(AffiliateView(Affiliate, db.session))