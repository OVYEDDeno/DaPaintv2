from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import hashlib, re, os
from api import send_email
from api.models import db, InviteCode,Ads, AffiliateView, User, DaPaint, DonePaints, UserImg, Notifications, Insight, UserDisqualification, Reports, invitee_association, Feedback, Ticket, Orders, ChatMessages, Affiliate
from flask_cors import CORS
from datetime import datetime, date, timedelta, timezone
from sqlalchemy import or_, and_, func, desc
from sqlalchemy.orm import aliased
import cloudinary.uploader as uploader
from cloudinary.uploader import destroy
from cloudinary.api import delete_resources_by_tag
import cloudinary
import random, string
from sqlalchemy.orm import aliased
from sqlalchemy import func, text
import stripe, logging, pytz
from decimal import Decimal
# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

api = Blueprint('api', __name__)
chat_bp = Blueprint('chat', __name__)
WINSTREAK_GOAL = os.getenv("WINSTREAK_GOAL") or 10
CORS(api)
CORS(chat_bp)

@api.route('/login', methods=['POST'])
def handle_user_login():
    email = request.json.get("email", None)
    name = request.json.get("email", None)
    password = request.json.get("password", None)

    if (email is None and name is None) or password is None:
        return jsonify({"msg": "No username/email or password"}), 400

    user = User.query.filter(or_(User.email == email, User.name == name)).one_or_none()
    if user is None:
        return jsonify({"msg": "No such user"}), 404

    if not hashlib.sha512(password.encode()).hexdigest() == user.password: 
        return jsonify({"msg": "Bad password. Update it please"}), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=10))
    return jsonify(access_token=access_token), 200

def generate_unique_invite_code(length=10):
    while True:
        # Generate a random alphanumeric code
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=length))
        
        # Check if the code already exists in the User table
        existing_code = InviteCode.query.filter_by(code=code).first()
        if not existing_code:
            # If code is unique, return it
            return code

@api.route('/signup', methods=['POST'])
def handle_user_signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    city = data.get('city')
    zipcode = data.get('zipcode')
    phone = data.get('phone')
    birthday_str = data.get('birthday')
    birthday = datetime.strptime(birthday_str, '%Y-%m-%d').date() if birthday_str else None

    errors = {}

    if errors:
        return jsonify({"errors": errors}), 400

    if birthday:
        age = (date.today() - birthday).days // 365
        if age < 18:
            return jsonify({"errors": {'birthday': 'User must be at least 18 years old'}}), 409

    user = User.query.filter_by(email=email).one_or_none()
    if user:
        return jsonify({"errors": {'email': 'An account associated with the email already exists'}}), 409

    username_check = User.query.filter_by(name=name).one_or_none()
    if username_check:
        return jsonify({"errors": {'name': 'An account associated with the username already exists'}}), 409

    if not re.match("^[a-zA-Z0-9]+$", name):
        return jsonify({"errors": {'name': 'Username can only contain letters and numbers'}}), 400

    if not re.match(r"^\d{5}$", zipcode):
        return jsonify({"errors": {'zipcode': 'ZipCode must contain exactly 5 digits'}}), 409

    if not re.match(r"^\d{10}$", phone):
        return jsonify({"errors": {'phone': 'Phone number must contain exactly 10 digits'}}), 409

    new_user = User(
        email=email,
        password= hashlib.sha512(password.encode()).hexdigest(),
        name=name,
        city=city,
        zipcode=zipcode,
        phone=phone,
        birthday=birthday        
    )

    db.session.add(new_user)
    db.session.commit()
    db.session.refresh(new_user)
    invite_code = generate_unique_invite_code()
    new_invite_code = InviteCode(code=invite_code, inviter_id=new_user.id)
    db.session.add(new_invite_code)
    db.session.commit()
    return jsonify({'msg': 'User created successfully', 'invite_code': invite_code}), 201


@api.route("/forgot-password", methods=["POST"])
def forgetpassword():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message": "Email does not exist"}), 400

    token = create_access_token(identity=email, expires_delta=timedelta(hours=1))
    email_value = f"Here is the password recovery link!\n{os.getenv('FRONTEND_URL')}/forgot-password?token={token}"
    send_email(email, email_value, "Subject: Password Recovery")

    return jsonify({"message": "Recovery password has been sent"}), 200


@api.route("/change-password", methods=["PUT"])
@jwt_required()
def changepassword():
    data = request.get_json()
    password = data.get("password")
    if not password:
        return jsonify({"message": "Please provide a new password."}), 400

    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email does not exist"}), 400

    user.password = hashlib.sha512(password.encode()).hexdigest()
    db.session.commit()

    send_email(email, "Your password has been changed successfully.", "Password Change Notification")
    return jsonify({"message": "Password successfully changed."}), 200

@api.route('/user/edit', methods=['PUT'])
@jwt_required()
def handle_user_edit():
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if user is None:
        return jsonify({"msg": "No user found"}), 404

    # Get JSON data from the request
    data = request.get_json()

    # Update only the fields that are present in the request
    if "email" in data:
        user.email = data["email"]
    if "name" in data:
        user.name = data["name"]
    if "city" in data:
        user.city = data["city"]
    if "zipcode" in data:
        user.zipcode = data["zipcode"]
    if "phone" in data:
        user.phone = data["phone"]
    if "birthday" in data:
        try:
            from datetime import datetime
            user.birthday = datetime.strptime(data["birthday"], "%m/%d/%Y").date()
        except ValueError:
            return jsonify({"msg": "Invalid birthday format, should be MM/DD/YYYY"}), 400
    if "instagram_url" in data:
        user.instagram_url = data["instagram_url"]
    if "tiktok_url" in data:
        user.tiktok_url = data["tiktok_url"]
    if "twitch_url" in data:
        user.twitch_url = data["twitch_url"]
    if "kick_url" in data:
        user.kick_url = data["kick_url"]
    if "youtube_url" in data:
        user.youtube_url = data["youtube_url"]
    if "twitter_url" in data:
        user.twitter_url = data["twitter_url"]
    if "facebook_url" in data:
        user.facebook_url = data["facebook_url"]

    # Commit the changes to the database
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"msg": "An error occurred while updating the user.", "error": str(e)}), 500

    # Refresh user object to reflect updated data and return a response
    db.session.refresh(user)
    return jsonify({"msg": "Account successfully edited!", "user": user.serialize()}), 200



@api.route('/user/get-user/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "No user found"}), 404
    return jsonify(user.serialize()), 200


@api.route('/current-user', methods=['GET'])
@jwt_required()
def get_current_user():
    user = User.query.get(get_jwt_identity())
    if user is None:
        return jsonify({"msg": "No user found"}), 404

    match = DaPaint.query.filter(
    and_(
        or_(DaPaint.foeId == user.id, DaPaint.hostFoeId == user.id),
        DaPaint.foeId.isnot(None)
    )
).order_by(desc(DaPaint.created_at)).first()
    tickets=Ticket.query.filter_by(user_id=user.id).all()
    if match is None:
        return jsonify({
            "user": user.serialize(),
            "tickets": [ticket.serialize() for ticket in tickets] if len(tickets) > 0 else [],
            "hasfoe": False,
            "dapaintId": None,
            "indulgers": None
        }), 200

    return jsonify({
        "user": user.serialize(),
        "tickets": [ticket.serialize() for ticket in tickets] if len(tickets) > 0 else [],
        "hasfoe": True,
        "dapaintId":match.serialize(),
        "indulgers": {
            "host": match.host_user.serialize() if match.hostFoeId else None,
            "foe": match.foe_user.serialize() if match.foeId else None
        }
    }), 200

@api.route('/max-win-streak', methods=['GET'])
@jwt_required()
def get_max_win_streak():    
    # Subquery to find the maximum win streak
    max_winstreak_subquery = db.session.query(
        db.func.max(User.winstreak).label('max_winstreak')
    ).subquery()

    # Alias for the User table
    user_alias = aliased(User)

    # Query to get the user with the maximum win streak
    user_with_max_winstreak = db.session.query(user_alias).join(
        max_winstreak_subquery,
        user_alias.winstreak == max_winstreak_subquery.c.max_winstreak
    ).first()

    # Ensure the user is found
    if user_with_max_winstreak:
        return jsonify({
            "maxWinStreak": user_with_max_winstreak.winstreak,
            "maxWinStreakUser": user_with_max_winstreak.serialize(),
            "WinStreakGoal": WINSTREAK_GOAL
        }), 200
    else:
        return jsonify({"message": "No user found"}), 404


# @api.route('/max-invitee', methods=['GET'])
# @jwt_required()
# def get_max_invitee():
#     # Subquery to count invitees for each inviter who have at least 1 win or 1 loss
#     invitee_count_subquery = (
#         db.session.query(
#             InviteCode.inviter_id,
#             func.count(InviteCode.id).label("invitee_count")
#         )
#         .join(User, User.invited_by.has(InviteCode.id == InviteCode.id))  # Use .has() for relationship filtering
#         .filter((User.wins > 0) | (User.losses > 0))  # Filter invitees with at least 1 win or 1 loss
#         .group_by(InviteCode.inviter_id)  # Group by inviter_id to count invitees
#         .subquery()
#     )

#     # Alias for the User table
#     user_alias = aliased(User)

#     # Query to get the user with the maximum invitee count
#     user_with_max_invitees = (
#         db.session.query(user_alias, invitee_count_subquery.c.invitee_count)
#         .join(invitee_count_subquery, user_alias.id == invitee_count_subquery.c.inviter_id)
#         .order_by(invitee_count_subquery.c.invitee_count.desc())
#         .first()
#     )

#     # Ensure a user with maximum invitees is found
#     if user_with_max_invitees:
#         return jsonify({
#             "maxInviteeCount": user_with_max_invitees[1],  # Invitee count
#             "maxInviteeUser": user_with_max_invitees[0].serialize()  # User details
#         }), 200
#     else:
#         return jsonify({"message": "No inviter found with invitees who have completed DaPaints"}), 404

@api.route('/max-invitee', methods=['GET'])
@jwt_required()
def get_max_invitee():
    # Subquery to count completed DaPaints for each inviter
    completed_dapaints_subquery = (
        db.session.query(
            InviteCode.inviter_id,
            func.count(User.id).label("completed_dapaints_count")
        )
        .join(InviteCode.invitees)  # Use the relationship defined in the model
        .filter((User.wins > 0) | (User.losses > 0))  # Count users with completed DaPaints
        .group_by(InviteCode.inviter_id)
        .subquery()
    )

    # Alias for the User table
    user_alias = aliased(User)

    # Query to get the user with the maximum completed DaPaints count
    user_with_max_completed_dapaints = (
        db.session.query(user_alias, completed_dapaints_subquery.c.completed_dapaints_count)
        .join(completed_dapaints_subquery, user_alias.id == completed_dapaints_subquery.c.inviter_id)
        .order_by(completed_dapaints_subquery.c.completed_dapaints_count.desc())
        .first()
    )

    # Ensure a user with maximum completed DaPaints is found
    if user_with_max_completed_dapaints:
        return jsonify({
            "maxCompletedDaPaintsCount": user_with_max_completed_dapaints[1],  # Completed DaPaints count
            "maxCompletedDaPaintsUser": user_with_max_completed_dapaints[0].serialize()  # User details
        }), 200
    else:
        return jsonify({"message": "No inviter found with invitees who have completed DaPaints"}), 404


@api.route('/user-img', methods=['POST'])
@jwt_required()
def user_img():
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if user is None:
        return jsonify({"msg": "No user found"}), 404

    image = request.files.get('file')
    if not image:
        return jsonify({"msg": "No image uploaded"}), 400

    # Check if user already has an image
    existing_image = UserImg.query.filter_by(user_id=user.id).first()
    
    if existing_image:
        # Delete the old image from Cloudinary
        try:
            uploader.destroy(existing_image.public_id)
        except Exception as e:
            print(f"Error deleting old image: {str(e)}")
        
        # Delete the old image record from the database
        db.session.delete(existing_image)
        db.session.commit()

    # Upload the new image
    try:
        upload_result = uploader.upload(image)
    except Exception as e:
        return jsonify({"msg": f"Error uploading image: {str(e)}"}), 500

    # Create new image record
    new_image = UserImg(
        public_id=upload_result['public_id'],
        image_url=upload_result['secure_url'],
        user_id=user.id
    )
    
    db.session.add(new_image)    
    db.session.commit()

    return jsonify({
        "msg": "Image successfully uploaded",
        "image_url": new_image.image_url
    }), 200

@api.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    search_term = request.args.get('search', '')
    users = User.query.filter(
        or_(
            User.name.ilike(f"%{search_term}%"),
            User.email.ilike(f"%{search_term}%")
        )
    ).all()
    return jsonify([user.serialize() for user in users]), 200

@api.route('/city', methods=['GET'])
def get_users():
    users = User.query.with_entities(User.city).all()  # Fetch only citys
    return jsonify([{"city": user.city} for user in users])

@api.route('/done', methods=['GET'])
def get_dones():
    dones = DonePaints.query.with_entities(DonePaints.id).all()  # Fetch only ids
    return jsonify([{"id": DonePaints.id} for DonePaints in dones])


@api.route('/dapaint', methods=['POST'])
@jwt_required()
def create_dapaint():
    user_id = get_jwt_identity()
    data = request.get_json()
    fitnessStyle = data.get('fitnessStyle')
    location = data.get('location')
    date_time_str = data.get('date_time')
    price = data.get('price')

    try:
        date_time = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"msg": "Invalid date format"}), 400

    new_dapaint = DaPaint(
        hostFoeId=user_id,
        fitnessStyle=fitnessStyle,
        location=location,
        date_time=date_time,
        price=price
    )

    db.session.add(new_dapaint)
    db.session.commit()

    return jsonify(new_dapaint.serialize()), 201

@api.route('/lineup/<id>', methods=['PATCH'])
@jwt_required()
def update_lineup(id):
    user_id = get_jwt_identity()
    data = request.get_json()

    # Fetch the event by its ID
    event = DaPaint.query.get(id)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    # Only update if the user is not the host (similar to your frontend logic)
    if event.hostFoeId == user_id:
        return jsonify({"error": "You cannot Lock into your own event"}), 403

    # Check if foeId is in the request body
    foe_id = data.get('foeId')
    if foe_id:
        event.foeId = foe_id
    else:
        return jsonify({"error": "foeId is required"}), 400

    # Commit the changes to the database
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    # Return the updated event
    return jsonify(event.serialize()), 200

@api.route("/forfeit/<dapaint_id>", methods=['PUT'])
@jwt_required()
def forfeit(dapaint_id):
    user_id = get_jwt_identity()
    daPaint = DaPaint.query.get(dapaint_id)
    if not daPaint:
        return jsonify({"error": "DaPaint not found"}), 404
    if daPaint.hostFoeId!= user_id and daPaint.foeId!= user_id:
        return jsonify({"error": "You can't forfeit events you're not a part of"}), 403
    if daPaint.winnerId or daPaint.loserId:
        return jsonify({"error": "This event has already been decided"}), 403
    daPaint.loserId = user_id    
    host=User.query.filter_by(id=daPaint.hostFoeId).first()
    foe=User.query.filter_by(id=daPaint.foeId).first()
    if host.id == user_id:
        host.winstreak=0
        host.losses+=1
        foe.winstreak+=1
        daPaint.winnerId=daPaint.foeId  
        foe_notif=Notifications(user_id=foe.id, type="Forfeit", message=f"{host.name} has forfeited the event. Your winstreak has been increased.")
        db.session.add(foe_notif)
    if foe.id == user_id:
        foe.winstreak=0
        foe.losses+=1
        host.winstreak+=1
        daPaint.winnerId=daPaint.hostFoeId
        host_notif=Notifications(user_id=host.id, type="Forfeit", message=f"{foe.name} has forfeited the event. Your winstreak has been increased.")
        db.session.add(host_notif) 
    db.session.delete(daPaint)
    db.session.commit()
    return jsonify({"msg": "Event forfeited successfully"}), 200

@api.route("/cancel/<dapaint_id>", methods=['PUT'])
@jwt_required()
def cancel(dapaint_id):
    user_id = get_jwt_identity()
    daPaint = DaPaint.query.get(dapaint_id)
    if not daPaint:
        return jsonify({"error": "DaPaint not found"}), 404
    if daPaint.hostFoeId!= user_id and daPaint.foeId!= user_id:
        return jsonify({"error": "You can't cancel events you're not a part of"}), 403
    if daPaint.winnerId or daPaint.loserId:
        return jsonify({"error": "This event has already been decided"}), 403
    host=User.query.filter_by(id=daPaint.hostFoeId).first()
    foe=User.query.filter_by(id=daPaint.foeId).first()

    if daPaint.foeId==user_id:
        daPaint.foeId=None
        new_notif=Notifications(user_id=host.id , type="Cancel", message=f"{foe.name} has cancelled  the event.")
        db.session.add(new_notif)

    if daPaint.hostFoeId==user_id:       
        new_host=daPaint.foeId
        daPaint.foeId=None
        daPaint.hostFoeId=new_host
        new_notif=Notifications(user_id=foe.id, type="Cancel", message=f"{host.name} has cancelled the event. You're the new host")
        db.session.add(new_notif)
        
    db.session.commit()
    return jsonify({"msg": "Event cancelled successfully"}), 200

@api.route('/lineup', methods=['GET'])
@jwt_required()
def get_all_dapaint():
    is_accepted = request.args.get("isaccepted")
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    winstreak = user.winstreak

    if is_accepted == '1':
        dapaint = DaPaint.query.filter(DaPaint.foeId.isnot(None), DaPaint.winnerId == None).all()
        serialized_data = []
        for paint in dapaint:
            paint_data = paint.serialize()
            ticket_count = len(Ticket.query.filter(Ticket.dapaint_id == paint.id).all())
            paint_data['ticket_count'] = ticket_count
            serialized_data.append(paint_data)
            
    else:
        subquery = db.session.query(DaPaint.hostFoeId).filter(DaPaint.foeId.isnot(None)).subquery()

        # Main query to exclude users who have matches with a foe
        dapaint = db.session.query(DaPaint).join(User, DaPaint.hostFoeId == User.id)\
            .filter(DaPaint.foeId.is_(None), User.winstreak == winstreak)\
            .filter(~DaPaint.hostFoeId.in_(subquery.select())).all()
        
        serialized_data = [paint.serialize() for paint in dapaint]  # No ticket count needed for non-accepted matches

    return jsonify(serialized_data), 200

@api.route('/public-lineup', methods=['GET'])
def get_public_lineup():
    dapaint = DaPaint.query.filter(DaPaint.foeId.isnot(None), DaPaint.winnerId == None).all()
    serialized_data = []
    for paint in dapaint:
        paint_data = paint.serialize()
        ticket_count = len(Ticket.query.filter(Ticket.dapaint_id == paint.id).all())
        paint_data['ticket_count'] = ticket_count
        serialized_data.append(paint_data)
    
    return jsonify(serialized_data), 200


# @api.route('/dapaint/delete/<id>', methods=['DELETE'])
# @jwt_required()
# def delete_dapaint(id):
#     dapaint = DaPaint.query.get(id)
#     if dapaint is None:
#         return jsonify({"msg": "No DaPaint found"}), 404 

#     db.session.delete(dapaint)
#     db.session.commit()

#     return jsonify({"message": "DaPaint record deleted successfully"}), 200

@api.route('/u/<name>', methods=['GET'])
@jwt_required()
def dapaint(name):
    user= User.query.filter_by(name=name).first()
    if user is None:
        return jsonify({"msg": "No user found"}), 404
    dapaint = DaPaint.query.filter(and_(or_(DaPaint.hostFoeId==user.id, DaPaint.foeId==user.id),and_(DaPaint.foeId != None, DaPaint.hostFoeId != None))).first()
    if dapaint is None:
        return jsonify({"msg": "No DaPaint found"}), 404

    return jsonify({"DaPaint":dapaint.serialize()}), 200
# @api.route('/dapaint/<id>', methods=['GET'])
# @jwt_required()
# def dapaint(id):
#     dapaint = DaPaint.query.get(id)
#     if dapaint is None:
#         return jsonify({"msg": "No DaPaint found"}), 404 


#     return jsonify({"DaPaint":dapaint.serialize()}), 200

@api.route('/checktime', methods=['GET'])
def check_time():
    current_time = datetime.now(timezone.utc)
    logger.debug(f"Current time: {current_time}")

    try:
        # Query for matches with no opponent that are past due
        expired_matches_no_opponent = db.session.query(DaPaint).filter(
            DaPaint.date_time < current_time,
            DaPaint.foeId.is_(None)
        ).all()
        logger.debug(f"Expired matches with no opponent: {len(expired_matches_no_opponent)}")

        # Query for completed matches to move to DonePaints
        completed_matches = db.session.query(DaPaint).filter(
            DaPaint.date_time < current_time,
            # DaPaint.date_time > current_time,
            DaPaint.winnerId.isnot(None),
            DaPaint.loserId.isnot(None)
        ).all()
        logger.debug(f"Completed matches: {len(completed_matches)}")

        # Query for old notifications
        time_threshold = current_time - timedelta(hours=24)
        past_notif = db.session.query(Notifications).filter(Notifications.created_at < time_threshold)
        logger.debug(f"Past notifications to delete: {past_notif.count()}")

        # Process completed matches (move to DonePaints)
        for match in completed_matches:
            logger.debug(f"Processing completed match ID: {match.id}")
            donepaint = DonePaints(
                winnerId=match.winnerId,
                loserId=match.loserId,
                host_winnerImg=match.host_winnerImg,
                foe_winnerImg=match.foe_winnerImg,
                finalized_at=match.date_time
            )
            db.session.add(donepaint)

        # Commit DonePaints additions first
        db.session.commit()
        logger.debug("Committed DonePaints records")

        # Now delete the DaPaint records
        for match in completed_matches:
            db.session.delete(match)

        # Process expired matches with no opponent
        for match in expired_matches_no_opponent:
            message = f"Your DaPaint on {match.date_time.strftime('%Y-%m-%d %H:%M:%S')} has expired. You can create a new one without having to pay."
            notification = Notifications(
                user_id=match.hostFoeId,
                type="Past Due",
                message=message
            )
            db.session.add(notification)
            db.session.delete(match)

        # Delete expired notifications
        past_notif.delete(synchronize_session=False)

        # Final commit
        db.session.commit()
        logger.debug("Final commit completed")

        return jsonify(message="Expired records processed and deleted successfully"), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"An error occurred: {str(e)}")
        return jsonify(error=f"An error occurred: {str(e)}"), 500

@api.route('/reset-win-streak', methods=['PUT'])
@jwt_required()
def reset_win_streak():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    user.winstreak = 0
    db.session.commit()
    return jsonify({"message": "Goal reached Wins Streak Reset!"}), 200

@api.route('/update-win-streak/<dapaint_id>', methods=['PUT'])
@jwt_required()
def update_win_streak(dapaint_id):
    user_id = get_jwt_identity()  # Get the ID of the user making the request
    data = request.get_json()
    winner_vote = data.get('winner')
    loser_vote = data.get('loser')
    img_url = data.get('img_url', None)  # Optional image for report
    dapaint_unlocked = data.get('dapaint_unlocked', True)  # Default to True if not provided

    print(f"Received winner_vote: {winner_vote}, loser_vote: {loser_vote}, dapaint_unlocked: {dapaint_unlocked}")
    
    if not winner_vote or not loser_vote:
        return jsonify({"msg": "Winner and loser votes are required."}), 400

    # Fetch the DaPaint record
    daPaint = DaPaint.query.get(dapaint_id)
    if daPaint is None:
        return jsonify({"msg": "No DaPaint found"}), 404

    # Determine if the user is the host or the foe
    if daPaint.hostFoeId == user_id:
        if daPaint.host_winnerId is not None or daPaint.host_loserId is not None:
            return jsonify({"msg": "Host has already made their choice."}), 400
    
        daPaint.host_winnerId = winner_vote
        daPaint.host_loserId = loser_vote
        daPaint.host_winnerImg = img_url  # Optional image for report
        print(f"Host's choice: winnerId={winner_vote}, loserId={loser_vote}, hostImg={img_url}")

    elif daPaint.foeId == user_id:
        if daPaint.foe_winnerId is not None or daPaint.foe_loserId is not None:
            return jsonify({"msg": "Foe has already made their choice."}), 400

        daPaint.foe_winnerId = winner_vote
        daPaint.foe_loserId = loser_vote
        daPaint.foe_winnerImg = img_url
        print(f"Foe's choice: winnerId={winner_vote}, loserId={loser_vote}, foeImg={img_url}")
    else:
        return jsonify({"msg": "User is neither the host nor the foe."}), 403
    

    try:
        db.session.commit()
        print("Database commit successful.")
    except Exception as e:
        print(f"Database commit failed: {e}")
        return jsonify({"msg": "Database commit failed"}), 500

    db.session.refresh(daPaint)

    # Check for conflict
    if daPaint.host_winnerId and daPaint.foe_winnerId:
        if daPaint.host_winnerId != daPaint.foe_winnerId:
            # Conflict found, create a report
            if not img_url:
                return jsonify({"msg": "Conflict detected! Please provide an image for the report."}), 400

            conflict_report = Reports(
                user_id=user_id,
                dapaint_id=dapaint_id,
                host_winnerImg=daPaint.host_winnerImg,
                foe_winnerImg=daPaint.foe_winnerImg            
            )
            db.session.add(conflict_report)
            db.session.commit()
            print(f"Conflict report created for DaPaint ID: {dapaint_id}")

    if daPaint.host_winnerId and daPaint.foe_winnerId and daPaint.host_winnerId == daPaint.foe_winnerId:
        winner = User.query.get(winner_vote)
        loser = User.query.get(loser_vote)
        if not winner or not loser:
            return jsonify({"msg": "Winner or loser not found"}), 404

        # Update win/loss stats
        winner.wins += 1
        winner.winstreak += 1        
        winner.dapaint_unlocked = dapaint_unlocked  # Use the value from the request
        loser.losses += 1
        loser.winstreak = 0
        loser.dapaint_unlocked = dapaint_unlocked  # Use the value from the request
        
        daPaint.winnerId = winner.id
        daPaint.loserId = loser.id

        try:
            db.session.commit()
            print("Winner and loser stats updated.")
        except Exception as e:
            print(f"Stats update failed: {e}")
            return jsonify({"msg": "Stats update failed"}), 500

    return jsonify(daPaint.serialize()), 200

@api.route('/update-winstreak/<int:dapaint_id>', methods=['PUT'])
def update_winstreak(dapaint_id):
    data = request.get_json()
    match = DaPaint.query.get(dapaint_id)
    if not match:
        return jsonify({"msg": "Match not found"}), 404
    if match.winnerId or match.loserId:  # Already submitted
        return jsonify({"msg": "Winstreak already submitted"}), 409
    
    # Update logic here
    match.winnerId = data['winnerId']
    match.loserId = data['loserId']
    match.host_winnerImg = data['imgUrl'] if data['winnerId'] == match.hostFoeId else None
    match.foe_winnerImg = data['imgUrl'] if data['winnerId'] != match.hostFoeId else None
    db.session.commit()
    return jsonify({"msg": "Winstreak updated"}), 200

@api.route('/update-report', methods=['PUT'])
def update_winner_loser():
    # Require a secret password in the request headers
    # secret_password = request.json.get("Secret-Password")
    # secret_password = "C"
    # if secret_password != os.getenv("YOUKNOW"):  # Replace with your actual secret password
    #     return jsonify({"msg": "Unauthorized access."}), 403

    # Retrieve JSON data
    data = request.get_json()
    report_id = data.get('report_id')
    dapaint_id = data.get('dapaint_id')
    winner_id = data.get('winner_id')
    loser_id = data.get('loser_id')

    # Validate required data
    if not report_id or not dapaint_id or not winner_id or not loser_id:
        return jsonify({"msg": "Report ID, DaPaint ID, Winner ID, and Loser ID are required."}), 400

    # Fetch DaPaint entry
    daPaint = DaPaint.query.get(dapaint_id)
    if daPaint is None:
        return jsonify({"msg": "No DaPaint found with the given ID."}), 404

    # Ensure DaPaint has an associated report
    report = Reports.query.filter(and_(Reports.id == report_id, Reports.dapaint_id == dapaint_id)).first()
    if report is None:
        return jsonify({"msg": "No report found for the given DaPaint ID."}), 404

    # Update winner and loser details in DaPaint
    daPaint.winnerId = winner_id
    daPaint.loserId = loser_id

    # Update winner and loser stats
    winner = User.query.get(winner_id)
    loser = User.query.get(loser_id)
    if not winner or not loser:
        return jsonify({"msg": "Winner or loser not found."}), 404

    winner.wins += 1
    winner.winstreak += 1
    loser.losses += 1
    loser.winstreak = 0

    # Commit changes to the database
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"msg": f"Database commit failed: {e}"}), 500

    return jsonify({"msg": "Winner and loser updated successfully.", "daPaint": daPaint.serialize()}), 200

# Route to get all notifications for the logged-in user
@api.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({'error': 'User is not authenticated'}), 401

    # Query notifications for the current user
    notifications = Notifications.query.filter_by(user_id=user_id).all()

    # Serialize notifications
    notifications_list = [n.serialize() for n in notifications]

    return jsonify(notifications_list), 200


@api.route('/link-request/<string:platform>', methods=['POST'])
@jwt_required()
def send_notification(platform):
    data = request.get_json()
    indulger_id=data.get("indulgerId")
    
    if platform not in ['instagram', 'tiktok', 'twitch', 'kick', 'youtube', 'twitter', 'facebook']:
        return jsonify({"msg": "Invalid platform specified"}), 400

    indulger = User.query.get(indulger_id)
    
    if not indulger:
        return jsonify({"msg": "Indulger not found"}), 404

    # Create a notification to prompt the user to add their social media link
    message = f"Please update your profile to add a {platform.capitalize()} link."

    notification = Notifications(user_id=indulger.id, type="reminder", message=message)
    db.session.add(notification)
    db.session.commit()

    return jsonify({"msg": f"Notification sent to update {platform.capitalize()} link."}), 200

@api.route('/invitecodes', methods=['GET'])
@jwt_required()
def get_invite_codes():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({'error': 'User is not authenticated'}), 401

    # Query invite codes for the current user
    invite_codes = InviteCode.query.filter_by(inviter_id=user_id).all()

    # Serialize invite codes
    invite_codes_list = [code.serialize() for code in invite_codes]

    return jsonify(invite_codes_list), 200

@api.route('/use-free-dapaint', methods=['POST'])
@jwt_required()
def use_free_dapaint():
    # Get the current authenticated user
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({"message": "User not found"}), 404

    # Get the user's invite code
    invite_code = current_user.invite_code
    if not invite_code:
        return jsonify({"message": "No invite code found for user"}), 400

    # Calculate the number of invitees who have completed at least one DaPaint
    completed_count = sum(1 for invitee in invite_code.invitees if invitee.wins > 0 or invitee.losses > 0)

    # Check if there are free DaPaints left to use
    if invite_code.used_btn is None:
        invite_code.used_btn = 0  # Initialize if null
    if invite_code.used_btn >= completed_count:
        return jsonify({"message": "Invite People To Get A FREE DaPaint!"}), 400

    # Increment used_btn
    invite_code.used_btn += 1
    # Update total_left as completed_count - used_btn
    invite_code.total_left = completed_count - invite_code.used_btn
    db.session.commit()

    return jsonify({
        "message": "Free DaPaint used successfully",
        "total_left": invite_code.total_left
    }), 200

@api.route('/process-invite-code', methods=['POST'])
@jwt_required()
def process_invite_code():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Check if the current user exists
    if not current_user:
        return jsonify({"message": "User not found"}), 404

    # Check if the user already has an inviter
    if current_user.invited_by:
        return jsonify({"message": "Already invited", "hasInviter": True}), 200

    # Get the invite code from the request data
    data = request.get_json()
    invite_code = data.get('invite_code')

    # Check if the invite code was provided
    if not invite_code:
        return jsonify({"message": "Invite code is required"}), 400

    # Look for the invite code in the database
    invite_code_record = InviteCode.query.filter_by(code=invite_code).first()

    # Check if the invite code exists and is not the user's own code
    if not invite_code_record or invite_code_record.inviter_id == current_user_id:
        return jsonify({"message": "Invalid invite code"}), 400

    # Create an association between the current user and the invite code
    db.session.execute(invitee_association.insert().values(
        invite_code_id=invite_code_record.id,
        invitee_id=current_user_id,
        used_at=db.func.current_timestamp()
    ))

    # Commit the changes to the database
    db.session.commit()

    # Return success response
    return jsonify({
        "message": "Invite code processed successfully",
        "hasInviter": True,    
    }), 200

@api.route('/feedback', methods=['POST'])
@jwt_required()
def handle_feedback_submission():
    # Get the JSON data from the request
    data = request.get_json()
    
    # Extract the feedback details
    feedback_text = data.get('feedback')
    rating = data.get('rating')

    # Ensure the necessary fields are provided
    if not feedback_text or rating is None:
        return jsonify({"msg": "Feedback text and rating are required."}), 400

    # Ensure the rating is within the allowed range (e.g., 1-5)
    if not (1 <= rating <= 5):
        return jsonify({"msg": "Rating must be between 1 and 5."}), 400

    # Get the current user
    user_email = get_jwt_identity()
    user = User.query.get(user_email)

    if user is None:
        return jsonify({"msg": "No user found"}), 404

    # Create a new feedback entry
    new_feedback = Feedback(
        user_email=user.email,
        feedback_text=feedback_text,
        rating=rating,
        created_at=datetime.now(timezone.utc)
    )

    # Save feedback to the database
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify({"msg": "Feedback submitted successfully!"}), 201


@api.route('/capture-paypal-order', methods=['POST'])
@jwt_required()
def capture_order():
    data = request.get_json()
    user_id = get_jwt_identity()
    paypal_id = data.get('paypal_id')
    type_of_order = data.get('type_of_order')
    
    # Validate the incoming data
    if None in [paypal_id, user_id]:
        return jsonify({'error': 'User ID and PayPal ID are required!'}), 400
    
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found!'}), 404

    # Check if the order already exists
    order_exists = Orders.query.filter_by(paypal_id=paypal_id).first()
    if order_exists:
        return jsonify({'error': 'Order already exists!'}), 400
    
    # Create a new order record
    order = Orders(user_id=user_id, paypal_id=paypal_id, type_of_order=type_of_order)
    db.session.add(order)
    db.session.commit()
    
    print(order.type_of_order)

    # Handle the DaPaint unlocked order
    if order.type_of_order == "dapaint_unlocked":
        user.dapaint_unlocked = True
        db.session.commit()
        return jsonify({'message': 'DaPaint Unlocked!'}), 200

    # Handle ticket purchase order type
    if order.type_of_order == "ticket_purchase":
        dapaint_id = data.get('dapaint_id')
        qr_codes = data.get('qr_codes')
        
        # Validate the required data for ticket purchase
        if None in [dapaint_id, qr_codes]:
            return jsonify({'error': 'Dapaint ID and QR Codes are required for ticket purchase!'}), 400
        
        dapaint = DaPaint.query.filter_by(id=dapaint_id).first()
        if not dapaint:
            return jsonify({'error': 'Dapaint not found!'}), 404

        # Add tickets to the database
        for qr_code in qr_codes:
            new_ticket = Ticket(
                user_id=user_id,
                dapaint_id=dapaint.id,
                order_id=order.id,
                ticket_code=qr_code["ticket_code"],
                qr_code_path=qr_code["qr_code_path"],
            )
            db.session.add(new_ticket)
        
        # Commit all new tickets at once
        db.session.commit()
        return jsonify({'message': 'Tickets purchased successfully!'}), 201

    # If the type_of_order is not recognized
    return jsonify({'error': 'Invalid order type!'}), 400

@api.route('/fufill-order', methods=['POST'])
@jwt_required()
def fufill_order():
    data = request.get_json()
    user_id = get_jwt_identity()
    ticket_code = data.get('ticket_code')
    
    # Validate the incoming data
    if not ticket_code:
        return jsonify({'error': 'Ticket code is required!'}), 400

    # Retrieve the ticket based on the ticket code
    ticket = Ticket.query.filter_by(ticket_code=ticket_code).first()
    if not ticket:
        return jsonify({'error': 'Ticket not found!'}), 404

    # Get the order and user information
    order = Orders.query.filter_by(id=ticket.order_id, user_id=ticket.user_id).first()
    if not order:
        return jsonify({'error': 'Order not found!'}), 404

    # # Ensure the user matches the ticket's user
    # if ticket.user_id != user_id:
    #     return jsonify({'error': 'Unauthorized user!'}), 403

    # Process the order based on its type
    if order.type_of_order == "dapaint_unlocked":
        order.fulfilled = True
        db.session.commit()
        return jsonify({'message': 'DaPaint Unlocked!'}), 200
    elif order.type_of_order == "ticket_purchase":
        if ticket.already_scanned:
            return jsonify({'error': 'Ticket already scanned!'}), 400
        order.fulfilled = True
        ticket.already_scanned = True
        db.session.commit()
        return jsonify({'message': 'Ticket Fulfilled!'}), 200
    else:
        return jsonify({'error': 'Unknown order type!'}), 400


from functools import wraps

# Add debugging for API key
stripe_key = os.getenv('STRIPE_SECRET_KEY')
if not stripe_key:
    raise ValueError("STRIPE_SECRET_KEY not found in environment variables")
stripe.api_key = stripe_key

def handle_stripe_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except stripe.error.StripeError as e:
            return jsonify(error=str(e)), 403
        except Exception as e:
            return jsonify(error=str(e)), 500
    return decorated_function

# @api.route('/create-payment-intent', methods=['OPTIONS', 'POST'])
# @jwt_required()
# @handle_stripe_errors
# def create_payment_intent():
#     if request.method == 'OPTIONS':
#         return '', 204
    
#     data = request.get_json()
#     user_id = get_jwt_identity()
#     paypal_id = data.get('paypal_id')
#     type_of_order = data.get('type_of_order')
#     if not data or 'amount' not in data:
#         return jsonify(error="Amount is required"), 400

#     intent = stripe.PaymentIntent.create(
#         amount=data['amount'],
#         currency='usd',
#         metadata={'integration_check': 'accept_a_payment'},
#     )
#     user = User.query.filter_by(id=user_id).first()
#     if not user:
#         return jsonify({'error': 'User not found!'}), 404

#     # Check if the order already exists
#     order_exists = Orders.query.filter_by(paypal_id=intent.id).first()
#     if order_exists:
#         return jsonify({'error': 'Order already exists!'}), 400
    
#     # Create a new order record
#     order = Orders(user_id=user_id, paypal_id=intent.id, type_of_order=type_of_order)
#     db.session.add(order)
#     db.session.commit()
    
#     print(order.type_of_order)

#     # Handle the DaPaint unlocked order
#     if order.type_of_order == "dapaint_unlocked":
#         user.dapaint_unlocked = True
#         db.session.commit()
#         return jsonify({'message': 'DaPaint Unlocked!'}), 200

#     # Handle ticket purchase order type
#     if order.type_of_order == "ticket_purchase":
#         dapaint_id = data.get('dapaint_id')
#         qr_codes = data.get('qr_codes')
        
#         # Validate the required data for ticket purchase
#         if None in [dapaint_id, qr_codes]:
#             return jsonify({'error': 'Dapaint ID and QR Codes are required for ticket purchase!'}), 400
        
#         dapaint = DaPaint.query.filter_by(id=dapaint_id).first()
#         if not dapaint:
#             return jsonify({'error': 'Dapaint not found!'}), 404

#         # Add tickets to the database
#         for qr_code in qr_codes:
#             new_ticket = Ticket(
#                 user_id=user_id,
#                 dapaint_id=dapaint.id,
#                 order_id=order.id,
#                 ticket_code=qr_code["ticket_code"],
#                 qr_code_path=qr_code["qr_code_path"],
#             )
#             db.session.add(new_ticket)
        
#         # Commit all new tickets at once
#         db.session.commit()
#         return jsonify({
#         'clientSecret': intent.client_secret,
#     'message': 'Tickets purchased successfully!'}), 201

#     # If the type_of_order is not recognized
#     return jsonify({'error': 'Invalid order type!'}), 400
    

@api.route('/payout', methods=['POST'])
@jwt_required()
@handle_stripe_errors
def create_payout():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'amount' not in data:
        return jsonify(error="Amount is required"), 400

    payout = stripe.Payout.create(
        amount=data['amount'],
        currency='usd',
        stripe_account="acct_1QIyvyIurh11jVin"  # sandbox stripe acc
    )

    return jsonify({
        'success': True,
        'payoutId': payout.id
    })

@api.route('/create-payment-intent', methods=['OPTIONS', 'POST'])
@jwt_required()
@handle_stripe_errors
def create_payment_intent():
    if request.method == 'OPTIONS':
        return '', 204
    
    data = request.get_json()
    user_id = get_jwt_identity()
    type_of_order = data.get('type_of_order')
    amount = data.get('amount')

    # Validate required fields
    if not data or not amount or not type_of_order:
        return jsonify(error="Amount and type_of_order are required"), 400

    # Validate type_of_order
    valid_order_types = ["dapaint_unlocked", "ticket_purchase"]
    if type_of_order not in valid_order_types:
        return jsonify(error="Invalid order type!"), 400

    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency='usd',
        metadata={'integration_check': 'accept_a_payment'},
    )
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found!'}), 404

    # Check if the order already exists
    order_exists = Orders.query.filter_by(paypal_id=intent.id).first()
    if order_exists:
        return jsonify({'error': 'Order already exists!'}), 400
    
    # Create a new order record
    order = Orders(user_id=user_id, paypal_id=intent.id, type_of_order=type_of_order)
    db.session.add(order)
    db.session.commit()
    
    print(f"Order type: {order.type_of_order}")

    # Handle the DaPaint unlocked order
    if order.type_of_order == "dapaint_unlocked":
        user.dapaint_unlocked = True
        db.session.commit()
        return jsonify({
            'clientSecret': intent.client_secret,
            'message': 'DaPaint Unlocked!'
        }), 200

    # Handle ticket purchase order type
    if order.type_of_order == "ticket_purchase":
        dapaint_id = data.get('dapaint_id')
        qr_codes = data.get('qr_codes')
        
        # Validate the required data for ticket purchase
        if None in [dapaint_id, qr_codes]:
            return jsonify({'error': 'Dapaint ID and QR Codes are required for ticket purchase!'}), 400
        
        dapaint = DaPaint.query.filter_by(id=dapaint_id).first()
        if not dapaint:
            return jsonify({'error': 'Dapaint not found!'}), 404

        # Add tickets to the database
        for qr_code in qr_codes:
            new_ticket = Ticket(
                user_id=user_id,
                dapaint_id=dapaint.id,
                order_id=order.id,
                ticket_code=qr_code["ticket_code"],
                qr_code_path=qr_code["qr_code_path"],
            )
            db.session.add(new_ticket)
        
        # Commit all new tickets at once
        db.session.commit()
        return jsonify({
            'clientSecret': intent.client_secret,
            'message': 'Tickets purchased successfully!'
        }), 201

    # This should not be reached due to earlier validation, but keep as a fallback
    return jsonify({'error': 'Invalid order type!'}), 400



# Get all chat messages (excluding banned ones)
@chat_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_chat_messages():
    messages = ChatMessages.query.order_by(ChatMessages.created_at.asc()).limit(100).all()
    return jsonify([msg.serialize() for msg in messages]), 200

# Get banned messages
@chat_bp.route('/banned', methods=['GET'])
@jwt_required()
def get_banned_messages():
    banned = BanList.query.order_by(BanList.created_at.desc()).all()
    return jsonify([b.serialize() for b in banned]), 200

# Send a chat message
@chat_bp.route('/send', methods=['POST'])
@jwt_required()
def handle_new_message():
    # Get the JSON data from the request
    data = request.get_json()
    
    # Extract the message details
    chat_text = data.get('chat_text')

    # Ensure the necessary fields are provided
    # if not chat_text is None:
    #     return jsonify({"msg": "A chat is required."}), 400

    # Get the current user
    name = get_jwt_identity()
    user = User.query.get(name)

    if user is None:
        return jsonify({"msg": "No user found"}), 404

    # Create a new message entry
    new_message = ChatMessages(
        name=user.name,
        chat_text=chat_text,
        created_at=datetime.now(timezone.utc)
    )

    # Save message to the database
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"msg": "message submitted successfully!"}), 201


# Ban a chat message (admin use)
@chat_bp.route('/ban', methods=['POST'])
@jwt_required()
def ban_chat_message():
    data = request.get_json()
    user_id = data.get('user_id')
    chat_text = data.get('chat_text')
    ban_duration = data.get('ban_duration', 30)  # Default to 30 days

    if not user_id or not chat_text:
        return jsonify({'error': 'Missing fields'}), 400

    ban_entry = BanList(user_id=user_id, chat_text=chat_text, ban_duration=ban_duration)
    db.session.add(ban_entry)

    # Also update the chat message to reflect it's banned
    chat_message = ChatMessages.query.filter_by(user_id=user_id, chat_text=chat_text).first()
    if chat_message:
        chat_message.ban = datetime.now(pytz.utc)

    db.session.commit()
    return jsonify({'message': 'User banned and message marked'}), 200
    

@api.route('/create-ad', methods=['POST'])
@jwt_required()
def create_ad():
    """
    Create a new ad for the authenticated user.
    Expects JSON payload with ad details matching the Ads model.
    First-time advertisers receive $10 in available_funds; others start with $0.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'msg': 'No input data provided'}), 400

        user_id = get_jwt_identity()  # Get user_id from JWT token

        # Check if user is a first-time advertiser
        is_first_time_advertiser = Ads.query.filter_by(user_id=user_id).count() == 0
        initial_funds = Decimal('10.00') if is_first_time_advertiser else Decimal('0.00')

        # Validate required fields
        required_fields = ['adTitle', 'audience', 'src', 'alt', 'href']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'msg': f'Missing required field: {field}'}), 400

        # Validate zipcodes (if provided)
        zipcodes = data.get('zipcodes', '').split(',')
        zipcodes = [z.strip() for z in zipcodes if z.strip()]
        if zipcodes:
            for zipcode in zipcodes:
                if not re.match(r'^\d{5}$', zipcode):
                    return jsonify({'msg': f'Invalid zipcode format: {zipcode}'}), 400

        # Validate keywords (if provided)
        keywords = data.get('keywords', '').split(',')
        keywords = [k.strip() for k in keywords if k.strip()]

        # Validate daily_spending_limit
        try:
            daily_spending_limit = Decimal(data.get('budget', '0.01'))
            if daily_spending_limit <= 0:
                return jsonify({'msg': 'Daily budget must be greater than 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'msg': 'Invalid budget format'}), 400

        # Validate image URL format
        img_url = data.get('src')
        if not re.match(r'^https?://[^\s/$.?#].[^\s]*\.(jpg|jpeg|png|bmp|gif|tif|tiff|webp|heic|avif|pdf)$', img_url, re.IGNORECASE):
            return jsonify({'msg': 'Invalid image URL or unsupported format'}), 400

        # Create new ad
        new_ad = Ads(
            user_id=user_id,
            adTitle=data['adTitle'],
            audience=data['audience'],
            zipcodes=zipcodes if zipcodes else None,
            keywords=keywords if keywords else None,
            daily_spending_limit=daily_spending_limit,
            start_date=datetime.now(timezone.utc).date(),
            src=img_url,
            alt=data['alt'],
            href=data['href'],
            available_funds=initial_funds,  # $10 for first-time advertisers, $0 otherwise
            active=True,
            views=0,
            clicks=0,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )

        db.session.add(new_ad)
        db.session.commit()

        return jsonify({
            'msg': 'Ad created successfully',
            'ad': new_ad.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error creating ad: {str(e)}'}), 500
    
@api.route('/track-ad', methods=['GET'])
@jwt_required()
def track_ad():
    """
    Retrieve performance data for all ads belonging to the authenticated user.
    Returns a list of ads with their views, clicks, and other details.
    """
    try:
        user_id = get_jwt_identity()
        ads = Ads.query.filter_by(user_id=user_id).all()

        if not ads:
            return jsonify({'msg': 'No ads found for this user'}), 404

        return jsonify({
            'ads': [ad.serialize() for ad in ads]
        }), 200

    except Exception as e:
        return jsonify({'msg': f'Error retrieving ads: {str(e)}'}), 500
    


@api.route('/affiliate', methods=['POST'])
@jwt_required()
def create_affiliate():
    """
    Create a new affiliate ad for the authenticated user.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'msg': 'No input data provided'}), 400

        user_id = get_jwt_identity()

        # Validate required fields for Affiliate model
        required_fields = ['src', 'href']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'msg': f'Missing required field: {field}'}), 400

        # You can add more validations here if needed (e.g. URL format)

        # Create new Affiliate entry
        new_ad = Affiliate(
            user_id=user_id,
            views=0,
            clicks=0,
            src=data['src'],
            href=data['href']
        )

        db.session.add(new_ad)
        db.session.commit()

        return jsonify({
            'msg': 'Affiliate ad created successfully',
            'ad': new_ad.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error creating affiliate ad: {str(e)}'}), 500
@api.route('/affiliate-ads/<int:ad_id>/view', methods=['POST'])
@jwt_required()
def increment_view(ad_id):
    user_id = get_jwt_identity()

    # Increment total impressions (the general 'views' field)
    ad = Affiliate.query.get_or_404(ad_id)
    ad.views += 1
    ad.last_shown = datetime.now(timezone.utc)

    # Record unique view if not already recorded for this user + ad
    existing_view = AffiliateView.query.filter_by(user_id=user_id, ad_id=ad_id).first()
    if not existing_view:
        new_view = AffiliateView(user_id=user_id, ad_id=ad_id)
        db.session.add(new_view)

    db.session.commit()

    return jsonify({'msg': 'View recorded', 'total_views': ad.views}), 200



@api.route('/affiliate-ads/<int:ad_id>/click', methods=['POST'])
def increment_click(ad_id):
    ad = Affiliate.query.get_or_404(ad_id)
    ad.clicks += 1
    db.session.commit()
    return jsonify({'msg': 'Click count incremented', 'clicks': ad.clicks}), 200

# @api.route('/affiliate-ads', methods=['GET'])
# def get_affiliate_ads():
#     thirty_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=30)
#     ads = Affiliate.query.filter(
#         (Affiliate.last_shown == None) | (Affiliate.last_shown < thirty_mins_ago)
#     ).order_by(Affiliate.clicks.desc()).all()
#     return jsonify([ad.serialize() for ad in ads])

@api.route('/affiliate-ads', methods=['GET'])
def get_affiliate_ads():
    ads = Affiliate.query.order_by(Affiliate.clicks.desc()).all()
    return jsonify([ad.serialize() for ad in ads])


@api.route('/affiliate/batch', methods=['POST'])
@jwt_required()
def create_affiliate_batch():
    try:
        data = request.get_json()
        if not isinstance(data, list):
            return jsonify({'msg': 'Expected a list of affiliate ads'}), 400

        user_id = get_jwt_identity()
        new_ads = []

        for ad_data in data:
            required_fields = ['src', 'href']
            for field in required_fields:
                if not ad_data.get(field):
                    return jsonify({'msg': f'Missing required field: {field}'}), 400

            new_ad = Affiliate(
                user_id=user_id,
                views=0,
                clicks=0,
                src=ad_data['src'],
                href=ad_data['href']
            )
            db.session.add(new_ad)
            new_ads.append(new_ad)

        db.session.commit()
        return jsonify({
            'msg': 'Affiliate ads created successfully',
            'ads': [ad.serialize() for ad in new_ads]
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error creating affiliate ads: {str(e)}'}), 500
