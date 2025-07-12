from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime, date

class LoginSchema(Schema):
    """
    Schema for user login validation.
    """
    email = fields.Email(required=True, error_messages={
        'required': 'Email is required',
        'invalid': 'Please provide a valid email address'
    })
    password = fields.Str(required=True, validate=validate.Length(min=6), error_messages={
        'required': 'Password is required',
        'validator_failed': 'Password must be at least 6 characters long'
    })

class SignupSchema(Schema):
    """
    Schema for user signup validation.
    """
    email = fields.Email(required=True, error_messages={
        'required': 'Email is required',
        'invalid': 'Please provide a valid email address'
    })
    password = fields.Str(required=True, validate=validate.Length(min=6), error_messages={
        'required': 'Password is required',
        'validator_failed': 'Password must be at least 6 characters long'
    })
    name = fields.Str(required=True, validate=validate.Regexp(r'^[a-zA-Z0-9]+$'), error_messages={
        'required': 'Username is required',
        'validator_failed': 'Username can only contain letters and numbers'
    })
    city = fields.Str(required=True, validate=validate.Length(min=2, max=80), error_messages={
        'required': 'City is required',
        'validator_failed': 'City must be between 2 and 80 characters'
    })
    zipcode = fields.Str(required=True, validate=validate.Regexp(r'^\d{5}$'), error_messages={
        'required': 'Zipcode is required',
        'validator_failed': 'Zipcode must contain exactly 5 digits'
    })
    phone = fields.Str(required=True, validate=validate.Regexp(r'^\d{10}$'), error_messages={
        'required': 'Phone number is required',
        'validator_failed': 'Phone number must contain exactly 10 digits'
    })
    birthday = fields.Date(required=True, error_messages={
        'required': 'Birthday is required',
        'invalid': 'Please provide a valid date'
    })

    def validate_birthday(self, value):
        """
        Custom validation to ensure user is at least 18 years old.
        """
        if value:
            age = (date.today() - value).days // 365
            if age < 18:
                raise ValidationError('User must be at least 18 years old')
        return value 