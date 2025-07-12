import unittest
from datetime import datetime, date
import sys
import os

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

# Import the existing models from the original models.py
from api.models import db, User, DaPaint, InviteCode

class TestModels(unittest.TestCase):
    """
    Test cases for the database models.
    
    This demonstrates how to write unit tests for your models
    to ensure they work correctly.
    """
    
    def setUp(self):
        """
        Set up test environment before each test.
        """
        # Import Flask app
        from app import create_app
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()
    
    def tearDown(self):
        """
        Clean up after each test.
        """
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_user_creation(self):
        """
        Test that a user can be created successfully.
        """
        with self.app.app_context():
            user = User(
                email='test@example.com',
                name='testuser',
                city='Test City',
                zipcode='12345',
                phone='1234567890',
                birthday=date(1990, 1, 1)
            )
            # Use the new password hashing method
            user.set_password('password123')
            
            db.session.add(user)
            db.session.commit()
            
            # Verify user was created
            self.assertIsNotNone(user.id)
            self.assertEqual(user.email, 'test@example.com')
            self.assertEqual(user.name, 'testuser')
            self.assertTrue(user.check_password('password123'))
    
    def test_user_password_hashing(self):
        """
        Test that passwords are properly hashed and verified.
        """
        with self.app.app_context():
            user = User(
                email='test@example.com',
                name='testuser',
                city='Test City',
                zipcode='12345',
                phone='1234567890',
                birthday=date(1990, 1, 1)
            )
            user.set_password('password123')
            
            # Test correct password
            self.assertTrue(user.check_password('password123'))
            
            # Test incorrect password
            self.assertFalse(user.check_password('wrongpassword'))
    
    def test_user_validation(self):
        """
        Test user field validation.
        """
        with self.app.app_context():
            # Test valid user
            user = User(
                email='test@example.com',
                name='testuser',
                city='Test City',
                zipcode='12345',
                phone='1234567890',
                birthday=date(1990, 1, 1)
            )
            user.set_password('password123')
            
            # This should not raise an exception
            db.session.add(user)
            db.session.commit()
            
            # Test invalid email
            with self.assertRaises(ValueError):
                user.email = 'invalid-email'
                db.session.commit()
    
    def test_dapaint_creation(self):
        """
        Test that a DaPaint match can be created successfully.
        """
        with self.app.app_context():
            # Create a user first
            user = User(
                email='test@example.com',
                name='testuser',
                city='Test City',
                zipcode='12345',
                phone='1234567890',
                birthday=date(1990, 1, 1)
            )
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
            
            # Create a DaPaint match
            dapaint = DaPaint(
                hostFoeId=user.id,
                fitnessStyle='Basketball',
                location='Central Park',
                date_time=datetime.now(),
                price=10
            )
            
            db.session.add(dapaint)
            db.session.commit()
            
            # Verify DaPaint was created
            self.assertIsNotNone(dapaint.id)
            self.assertEqual(dapaint.fitnessStyle, 'Basketball')
            self.assertEqual(dapaint.hostFoeId, user.id)
    
    def test_invite_code_generation(self):
        """
        Test that unique invite codes can be generated.
        """
        with self.app.app_context():
            # Create a user first
            user = User(
                email='test@example.com',
                name='testuser',
                city='Test City',
                zipcode='12345',
                phone='1234567890',
                birthday=date(1990, 1, 1)
            )
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
            
            # Create an invite code
            invite_code = InviteCode(
                code='TEST123456',
                inviter_id=user.id
            )
            
            db.session.add(invite_code)
            db.session.commit()
            
            # Verify invite code was created
            self.assertIsNotNone(invite_code.id)
            self.assertEqual(invite_code.code, 'TEST123456')
            self.assertEqual(invite_code.inviter_id, user.id)
    
    def test_user_serialization(self):
        """
        Test that user objects can be serialized correctly.
        """
        with self.app.app_context():
            user = User(
                email='test@example.com',
                name='testuser',
                city='Test City',
                zipcode='12345',
                phone='1234567890',
                birthday=date(1990, 1, 1)
            )
            user.set_password('password123')
            
            db.session.add(user)
            db.session.commit()
            
            # Serialize user
            serialized = user.serialize()
            
            # Verify serialization
            self.assertEqual(serialized['email'], 'test@example.com')
            self.assertEqual(serialized['name'], 'testuser')
            self.assertEqual(serialized['city'], 'Test City')
            self.assertIn('id', serialized)
            self.assertNotIn('password', serialized)  # Password should not be serialized


if __name__ == '__main__':
    unittest.main() 