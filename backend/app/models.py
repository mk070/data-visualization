from .db_setup import db

class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Define your columns based on expected data
    column1 = db.Column(db.String, nullable=True)
    column2 = db.Column(db.Float, nullable=True)
    # Add more columns as needed
