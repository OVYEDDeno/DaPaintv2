from . import db

class Orders(db.Model):
    """
    Orders model representing user payment orders.
    
    This model handles the storage and management of user payment orders
    for purchasing tickets and other services.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="orders")
    paypal_id = db.Column(db.String(500), unique=True)
    tickets = db.relationship('Ticket', backref='order', lazy=True)
    type_of_order = db.Column(db.String(20))
    fulfilled = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Orders {self.id}>'

    def serialize(self):
        """
        Serialize the Orders object for API responses.
        
        Returns:
            dict: Orders data in JSON-serializable format
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "paypal_id": self.paypal_id,
            "type_of_order": self.type_of_order,
            "fulfilled": self.fulfilled
        }


class Ticket(db.Model):
    """
    Ticket model representing event tickets.
    
    This model handles the storage and management of event tickets
    purchased by users for DaPaint matches.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(11), db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    dapaint_id = db.Column(db.String(12), db.ForeignKey('dapaint.id'), nullable=False)
    already_scanned = db.Column(db.Boolean, default=False)
    ticket_code = db.Column(db.String(255), unique=True, nullable=False)
    qr_code_path = db.Column(db.String(2048), nullable=True)

    user = db.relationship('User', back_populates='tickets')
    dapaint = db.relationship('DaPaint', back_populates='tickets')

    def __repr__(self):
        return f'<Ticket {self.id}>'

    def serialize(self):
        """
        Serialize the Ticket object for API responses.
        
        Returns:
            dict: Ticket data in JSON-serializable format
        """
        return {
            'id': self.id,
            'dapaint_id': self.dapaint_id,
            'user_id': self.user_id,
            'already_scanned': self.already_scanned,
            'ticket_code': self.ticket_code,
            'qr_code_path': self.qr_code_path,
            'dapaint': self.dapaint.serialize(),            
        } 