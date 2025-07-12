from flask import jsonify

class APIException(Exception):
    """
    Base API exception class for consistent error handling.
    """
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        rv['error'] = True
        return rv

    def to_response(self):
        """
        Convert exception to Flask response.
        """
        response = jsonify(self.to_dict())
        response.status_code = self.status_code
        return response


class ValidationError(APIException):
    """
    Exception raised when data validation fails.
    """
    status_code = 400

    def __init__(self, message="Validation failed", errors=None):
        super().__init__(message, self.status_code, {'errors': errors})


class AuthenticationError(APIException):
    """
    Exception raised when authentication fails.
    """
    status_code = 401

    def __init__(self, message="Authentication failed"):
        super().__init__(message, self.status_code)


class AuthorizationError(APIException):
    """
    Exception raised when user lacks required permissions.
    """
    status_code = 403

    def __init__(self, message="Access denied"):
        super().__init__(message, self.status_code)


class NotFoundError(APIException):
    """
    Exception raised when a resource is not found.
    """
    status_code = 404

    def __init__(self, message="Resource not found"):
        super().__init__(message, self.status_code)


class ConflictError(APIException):
    """
    Exception raised when there's a conflict (e.g., duplicate resource).
    """
    status_code = 409

    def __init__(self, message="Resource conflict"):
        super().__init__(message, self.status_code)


class ServerError(APIException):
    """
    Exception raised for internal server errors.
    """
    status_code = 500

    def __init__(self, message="Internal server error"):
        super().__init__(message, self.status_code) 