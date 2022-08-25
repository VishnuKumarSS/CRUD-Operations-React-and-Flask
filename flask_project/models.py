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
app.config["SQLALCHEMY_ECHO"] = True # to see all the raw queries on the CLI 

app.config["SECRET_KEY"] = os.environ["SECRET_KEY"] # this secret key is created in the .env file

app.config['SESSION_TYPE'] = "redis"
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True # we are gonna use secret key signer...so it's true
app.config['SESSION_URL'] = redis.from_url("redis://127.0.0.1:6379")

db = SQLAlchemy(app)

def get_uuid():
    return uuid4().hex #The UUID as a 32-character lowercase hexadecimal string.

class UserData(db.Model):
    # __tablename__ = "user_data"
    id = db.Column(db.Integer, primary_key=True) #unique=True
    # id = db.engine.execute(f"ALTER table user_Data ADD COLUMN email varchar(255)")
    uuid = db.Column(db.String(32), unique=True, default=get_uuid)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.Text, nullable=False)

    username = db.Column(db.String(50), nullable=False)
    userage = db.Column(db.Integer, nullable=False)
    usercity = db.Column(db.String(50), nullable=False)
    usertype = db.Column(db.String, nullable=False)







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


    
    def __str__(self):
        return f"{self.username} - {self.userage} - {self.usercity} - {self.usertype}"
        
# db.init_app(app)
# db.drop_all()
# db.create_all()

