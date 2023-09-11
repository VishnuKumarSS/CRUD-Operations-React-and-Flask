"""The module ``models.py`` is the main and default module for our flask application consist of several models to create database tables with several constraints.
This models script allows the user to create tables in the database with the given fields.

Models module consist of several classes to create tables with the constraints. This module requires the following package ``flask, flask_restful, flask_sqlalchemy, uuid, redis, dotenv`` be 
installed within the python environment where we are running this module.

This file ``models.py`` can also be imported as a module and contains the following:
    Classes ``(model)``:
        * ``Users`` - 
            The Users class inheriting from the ``db.model`` creates ``users`` table on the database with the following fields
            namely ``id, email, fullname, google_id, password`` and the field ``user_data`` as a relationship to the other table called 'user_data' 
            to create the connection or link between the 'users' table and the 'user_data' table.

        * ``UserData`` - 
            The UserData class inheriting from the ``db.model`` creates ``user_data`` table on the database with the following fields namely 
            ``id, username, userage, usercity, usertype`` and the ``users_id`` field as a Foreign Key of ``users`` table pointing ``id`` the primary key of users table.\n
    Functions:
        * ``get_uuid`` - 
            The ``get_uuid`` function will return a random UUID for 32-character lowercase hexadecimal string. 
            get_uuid is used in two classes (i.e. models for creating tables) namely Users and UserData for creating unique id for 'id' field in tables namely users and user_data
"""
from uuid import uuid4
import config
from app import db

# load_dotenv()

# app = Flask(__name__)
# api = Api(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = (
#     f"postgresql://"
#     f"starz1:"
#     f"starz1234@"
#     f"localhost/"
#     f"mydatabase"
# )

# app.config['SQLALCHEMY_DATABASE_URI'] = (
#     f"{settings.DB_ENGINE}://"
#     f"{settings.DB_USER}:{settings.DB_PASSWORD}@"
#     f"{settings.DB_HOST}:{settings.DB_PORT}/" # DB Port is optional
#     f"{settings.DB_NAME}"
# )

# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["SQLALCHEMY_ECHO"] = True  # to see all the raw queries on the CLI

# # this secret key is created in the .env file
# app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]

# app.config['SESSION_TYPE'] = "redis"
# app.config['SESSION_PERMANENT'] = False
# # we are gonna use secret key signer...so it's true
# app.config['SESSION_USE_SIGNER'] = True
# app.config['SESSION_URL'] = redis.from_url("redis://127.0.0.1:6379")

# db = SQLAlchemy(app)



# ------------------------



# # Create Flask application instance
# app = Flask(__name__)

# # Initialize Flask-RESTful API
# api = Api(app)

# # Apply the configurations from config.py
# app.config.from_object(config)

# # Initialize SQLAlchemy for database interaction
# db = SQLAlchemy(app)



def get_uuid():
    """The ``get_uuid`` function will return a random UUID for 32-character lowercase hexadecimal string. 
    get_uuid is used in two classes (i.e. models for creating tables) namely Users and UserData for creating unique id for 'id' field in tables namely users and user_data.
    
    :return: the 32-character lowercase hexadecimal string
    :rtype: str"""
    # The UUID as a 32-character lowercase hexadecimal string.
    return uuid4().hex


class Users(db.Model):
    """
    The Users class inheriting from the ``db.model`` creates ``users`` table on the database with the following fields namely 
    ``id, email, fullname, google_id, password`` and the field ``user_data`` as a relationship to the other table called 'user_data'
    to create the connection or link between the 'users' table and the 'user_data' table.
    """

    __tablename__ = 'users'

    id = db.Column(db.String(32), unique=True, default=get_uuid, primary_key=True)
    """The field ``id`` is the primary_key for the table ``users`` and with the unique constraint enabled.\n
    ``get_uuid`` method is called for the ``default`` argument to set the id for all the rows in a table by default automatically."""

    email = db.Column(db.String(255), unique=True, nullable=False)
    """The field ``email`` is a string of ``255`` characters with unique constraint enabled and cannot be null as well."""

    fullname = db.Column(db.String(50), nullable=False)
    """The field ``fullname`` is a string of ``50`` characters and cannot be null as well."""

    google_id = db.Column(db.String(), unique=True)
    """The field ``google_id`` is a string and ``can be null`` because users who are creating the account with the google account only have the google_id field."""

    password = db.Column(db.String(512), nullable=True)
    """The field ``password`` is a string of ``512`` characters and ``can be null`` because users who are creating the account without the google account only will have the password field."""
    
    # without the uselist we cannot directly access the child table's attributes
    user_data = db.relationship('UserData', backref='users', uselist=False)
    """The field ``user_data`` is not a column it's a relationship field with the ``backref`` set to ``users`` table to make both users and user_data table connected to eachothers."""
    # user_data = db.relationship('UserData', backref='users')

    def __str__(self):
        """This stringifies the email, fullname objects and returns. It helps while debugging the code.
        
        :return: string consisting of email and fullname
        :rtype: str
        """
        return f"{self.email} - {self.fullname}"


class UserData(db.Model):
    """
    The UserData class inheriting from the ``db.model`` creates ``user_data`` table on the database with the following fields namely 
    ``id, username, userage, usercity, usertype`` and the ``users_id`` field as a Foreign Key of ``users`` table pointing ``id`` the primary key of users table.
    """

    __tablename__ = "user_data"

    id = db.Column(db.String(32), unique=True, default=get_uuid, primary_key=True)
    """The field ``id`` is the primary_key for the table ``users`` and with the unique constraint enabled.\n
    ``get_uuid`` method is called for the ``default`` argument to set the id for all the rows in a table by default automatically."""

    username = db.Column(db.String(50), nullable=False)
    """The field ``username`` is a string of ``50`` characters and cannot be null."""

    userage = db.Column(db.Integer, nullable=False)
    """The field ``userage`` is a Integer and cannot be null as well."""

    usercity = db.Column(db.String(50), nullable=False)
    """The field ``usercity`` is a string of ``50`` characters and cannot be null as well."""

    usertype = db.Column(db.String, nullable=False)
    """The field ``usertype`` is also a string type and cannot be null as well."""

    users_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    """The field ``users_id`` is a string of ``32`` characters and It's the foreign key of the ``users`` table with the parameter of ``db.ForeignKey('users.id')``."""

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
