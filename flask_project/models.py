from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
import redis
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://starz1:starz1234@localhost/mydatabase"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True  # to see all the raw queries on the CLI

# this secret key is created in the .env file
app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]

app.config['SESSION_TYPE'] = "redis"
app.config['SESSION_PERMANENT'] = False
# we are gonna use secret key signer...so it's true
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_URL'] = redis.from_url("redis://127.0.0.1:6379")

db = SQLAlchemy(app)


def get_uuid():
    """This function will return a random UUID as a 32-character lowercase haxadecimal string.
    
    :return: the 32-character string
    :rtype: str"""
    # The UUID as a 32-character lowercase hexadecimal string.
    return uuid4().hex


class Users(db.Model):
    """This creates a users table on the database with he following fields."""

    __tablename__ = 'users'

    id = db.Column(db.String(32), unique=True,
                   default=get_uuid, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    fullname = db.Column(db.String(50), nullable=False)
    google_id = db.Column(db.String(), unique=True)
    password = db.Column(db.String(512), nullable=True)

    # without the uselist we cannot directly access the child table's attributes
    user_data = db.relationship('UserData', backref='users', uselist=False)
    # user_data = db.relationship('UserData', backref='users')

    def __str__(self):
        """This stringifies the email, fullname objects and returns. It helps while debugging the code.
        
        :return: string consisting of email and fullname
        :rtype: str
        """
        return f"{self.email} - {self.fullname}"


class UserData(db.Model):
    """This creates a users table on the database with he following fields."""

    __tablename__ = "user_data"

    id = db.Column(db.String(32), unique=True,
                   default=get_uuid, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    userage = db.Column(db.Integer, nullable=False)
    usercity = db.Column(db.String(50), nullable=False)
    usertype = db.Column(db.String, nullable=False)

    users_id = db.Column(db.String(32), db.ForeignKey('users.id'))

    def __str__(self):
        """This stringifies the username, userage, usercity, usertype objects and returns. It helps while debugging the code.
        
        :return: string consisting of username, userage, usercity, usertype
        :rtype: str
        """
        return f"{self.username} - {self.userage} - {self.usercity} - {self.usertype}"


# db.init_app(app)
# db.drop_all()
# db.create_all()
# db.engine.execute('drop table users')
# db.engine.execute('drop table user_data')

    # db.engine.execute(f"ALTER TABLE user_Data ADD id int NOT NULL if not exists id int, ADD username varchar(20) NOT NULL, ADD userage int NOT NULL, ADD usercity varchar(20) NOT NULL, ADD PRIMARY KEY (id)")

    # try:
    #     d = db.engine.execute(f"select * from user_data");
    #     if not d:
    #         db.engine.execute(
    #             f'''
    #             CREATE TABLE user_data(
    #                 username VARCHAR(20) NOT NULL,
    #                 userage int NOT NULL,
    #                 usercity VARCHAR(20) NOT NULL,
    #                 id int NOT NULL CONSTRAINT id_pk PRIMARY KEY
    #             );
    #             '''
    #         )
    # except:
    #     print('Table not exist.')
