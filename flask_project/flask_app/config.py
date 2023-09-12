import redis
from . import settings

# Flask App settings
DEBUG = settings.DEBUG
FLASK_APP = settings.FLASK_APP
FLASK_ENV = settings.FLASK_ENV
FLASK_DEBUG = settings.FLASK_DEBUG

# Set the database URI using settings from settings.py
SQLALCHEMY_DATABASE_URI = (
    f"{settings.DB_ENGINE}://"
    f"{settings.DB_USER}:{settings.DB_PASSWORD}@"
    f"{settings.DB_HOST}:{settings.DB_PORT}/"
    f"{settings.DB_NAME}"
)

# Disable tracking modifications (not recommended in production)
SQLALCHEMY_TRACK_MODIFICATIONS = settings.SQLALCHEMY_TRACK_MODIFICATIONS

# Enable echoing of SQL queries for debugging
SQLALCHEMY_ECHO = settings.SQLALCHEMY_ECHO

# Set the secret key from environment variable
SECRET_KEY = settings.SECRET_KEY

# Configure session management using Redis
SESSION_TYPE = settings.REDIS_SESSION_TYPE
SESSION_PERMANENT = settings.REDIS_SESSION_PERMANENT
SESSION_USE_SIGNER = settings.REDIS_SESSION_USE_SIGNER
SESSION_URL = redis.from_url(
    settings.REDIS_SESSION_URL
)




