import os
from dotenv import load_dotenv


load_dotenv()

# Secret Key
SECRET_KEY = os.environ["SECRET_KEY"]

# Flask ENV variables
DEBUG = os.environ.get('DEBUG', True)
FLASK_DEBUG = os.environ.get('FLASK_DEBUG', True)
FLASK_APP = os.environ.get('FLASK_APP')
FLASK_ENV = os.environ.get('FLASK_ENV')

# DATABASE
DB_ENGINE = os.environ.get('POSTGRES_DATABASE_ENGINE_PROD', 'postgresql')
DB_NAME = os.environ.get('POSTGRES_DATABASE_NAME_PROD', "user-management-admin-dashboard")
DB_USER = os.environ.get('POSTGRES_USER_PROD', "vishnu")
DB_PASSWORD = os.environ.get('POSTGRES_PASSWORD_PROD', "starzzzz")
DB_HOST = os.environ.get('POSTGRES_HOST_PROD', 'localhost')
DB_PORT = os.environ.get('POSTGRES_PORT_PROD', '5432')

# SQL Alchemy
# Disable tracking modifications (not recommended in production)
SQLALCHEMY_TRACK_MODIFICATIONS: bool = os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', False)
# Enable echoing of SQL queries for debugging
SQLALCHEMY_ECHO: bool = os.environ.get('SQLALCHEMY_ECHO', True)

# Configure session management using Redis
REDIS_SESSION_TYPE: str = os.environ.get('REDIS_SESSION_TYPE', 'redis')
REDIS_SESSION_PERMANENT: bool = os.environ.get('REDIS_SESSION_PERMANENT', False)
REDIS_SESSION_USE_SIGNER: bool = os.environ.get('REDIS_SESSION_USE_SIGNER', True)
REDIS_SESSION_URL: str = os.environ.get('REDIS_SESSION_URL', 'redis://127.0.0.1:6379')