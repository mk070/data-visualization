from flask import Flask
from flask_cors import CORS
from .db_setup import init_db
from .routes import main

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allow Cross-Origin Resource Sharing for your React frontend

    # Load configurations
    app.config.from_object('config.Config')

    # Initialize the database
    init_db(app)

    # Register routes
    app.register_blueprint(main)

    return app
