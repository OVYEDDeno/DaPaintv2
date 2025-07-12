import random
import string
import re
from datetime import datetime, date
from flask import jsonify
from marshmallow import ValidationError as MarshmallowValidationError

def generate_unique_invite_code(length=10):
    """
    Generate a unique invitation code.
    
    Args:
        length (int): Length of the code to generate
        
    Returns:
        str: A unique alphanumeric code
    """
    from ..models import InviteCode
    
    while True:
        # Generate a random alphanumeric code
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=length))
        
        # Check if the code already exists
        existing_code = InviteCode.query.filter_by(code=code).first()
        if not existing_code:
            return code


def validate_user_data(data):
    """
    Validate user data using regex patterns.
    
    Args:
        data (dict): User data to validate
        
    Returns:
        dict: Validation errors if any
    """
    errors = {}
    
    # Email validation
    if 'email' in data:
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            errors['email'] = 'Please provide a valid email address'
    
    # Username validation
    if 'name' in data:
        if not re.match(r'^[a-zA-Z0-9]+$', data['name']):
            errors['name'] = 'Username can only contain letters and numbers'
    
    # Phone validation
    if 'phone' in data:
        if not re.match(r'^\d{10}$', data['phone']):
            errors['phone'] = 'Phone number must contain exactly 10 digits'
    
    # Zipcode validation
    if 'zipcode' in data:
        if not re.match(r'^\d{5}$', data['zipcode']):
            errors['zipcode'] = 'Zipcode must contain exactly 5 digits'
    
    # Age validation
    if 'birthday' in data:
        try:
            if isinstance(data['birthday'], str):
                birthday = datetime.strptime(data['birthday'], '%Y-%m-%d').date()
            else:
                birthday = data['birthday']
            
            age = (date.today() - birthday).days // 365
            if age < 18:
                errors['birthday'] = 'User must be at least 18 years old'
        except (ValueError, TypeError):
            errors['birthday'] = 'Please provide a valid date'
    
    return errors


def format_response(data=None, message="Success", status_code=200, error=False):
    """
    Format API response consistently.
    
    Args:
        data: Response data
        message (str): Response message
        status_code (int): HTTP status code
        error (bool): Whether this is an error response
        
    Returns:
        tuple: (response, status_code)
    """
    response_data = {
        'message': message,
        'error': error
    }
    
    if data is not None:
        response_data['data'] = data
    
    response = jsonify(response_data)
    response.status_code = status_code
    return response, status_code


def handle_marshmallow_errors(validation_error):
    """
    Convert Marshmallow validation errors to API format.
    
    Args:
        validation_error: MarshmallowValidationError instance
        
    Returns:
        tuple: (response, status_code)
    """
    errors = {}
    for field, messages in validation_error.messages.items():
        if isinstance(messages, list):
            errors[field] = messages[0]  # Take first error message
        else:
            errors[field] = str(messages)
    
    return format_response(
        data={'errors': errors},
        message="Validation failed",
        status_code=400,
        error=True
    )


def sanitize_input(text):
    """
    Sanitize user input to prevent XSS and injection attacks.
    
    Args:
        text (str): Input text to sanitize
        
    Returns:
        str: Sanitized text
    """
    if not text:
        return text
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '(', ')', '{', '}']
    for char in dangerous_chars:
        text = text.replace(char, '')
    
    # Remove script tags
    text = re.sub(r'<script.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
    
    return text.strip()


def validate_date_format(date_string, format='%Y-%m-%d'):
    """
    Validate date string format.
    
    Args:
        date_string (str): Date string to validate
        format (str): Expected date format
        
    Returns:
        bool: True if valid, False otherwise
    """
    try:
        datetime.strptime(date_string, format)
        return True
    except ValueError:
        return False 