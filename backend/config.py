import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'AIzaSyDETaemf56DFjmm4CABsmqo-_1YuWftbSo')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'
