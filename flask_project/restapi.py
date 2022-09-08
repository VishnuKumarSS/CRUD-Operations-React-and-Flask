"""
The module ``restapi.py`` created using flask_restful to perform all the restful api standard CRUD operations and Login system with the authentication.

The restapi module allows the us to perform the Create, Read, Update and Delete operations using the request methods like ``POST, GET, PUT, DELETE``. 
There are methods to perform login and logout operation for normal and google authenticated user from firebase. 

Restapi module consist of several methods to perform CRUD and to login and logout the users.
It requires parameters of string for SearchUser method to perform the appropriate actions.
This module requires ``flask, flask_restful, flask_bcrypt, flask_session, flask_cors`` be 
installed within the python environment where we are running this module.

This file can also be imported as a module and contains the following:
    Classes:
        * ``ReactGoogleSignin`` - 
                ReactGoogleSignin class inheriting from Resource class from the flask_restful module used to create a user with google authenticated data coming from react application on the frontend.\n
                It will Create a user if not registered or Logs In the user if already registered by using the post method.\n
                ``POST``: 
                    Post method will get the user information like email, fullname, google_id from the frontend react application and stores the data on the database with the if the user data is not there in database, Otherwise it just logs in the user by creating session id called ``created_user_id``.
        * ``AllUsers`` -
                AllUsers class inheriting from Resource class of the flask_restful module used to get all the available users and users data from the tables ``users`` and ``user_data`` on the database.\n
                ``GET``:
                    The get method of class AllUsers will return all the users and users data stored in the database.
        * ``SearchUser`` - 
                SearchUser class inheriting from Resource class of the flask_restful module needs username of string type from the ``user_data`` to be passed in the url route for performing actions like searching, deleting and updating a particular user.
                The table ``user_data`` should have the username of string type passed as a parameter on the url route to perform all the actions on the methods namely ``get, delete, put``.
                Otherwise the actions will not be performed.\n
                ``GET``:
                    The get method of SearchUser class will search for the user and returns that user's details in a dictionary format if exist, otherwise it will abort the request with User Not found message.
                ``DELETE``:
                    The delete method of SearchUser class will delete the particular user and particular user's data if the username exist, otherwise abort the request.
                    It will not delete when there is session id of currently LoggedIn user. Because we cannot delete when we are already LoggedIn.
                ``PUT``:
                    The put method of SearchUser class will get the username of string type, if any matching user exist then it can update that particular user's data otherwise it cannot perform action.
        * ``CreateUser`` - 
                CreateUser class inheriting from Resource class of the flask_restful module used to create a particular user and to store all the data on the ``users`` and  table on the database and on the firebase for later authentication on the ``Login`` class.\n
                ``POST``:
                    The post method of the CreateUser class is used to create a user and store it on the database ``users`` table if not exist and on the firebase for email and password login. 
        * ``AddUserData`` - 
                AddUserData class inheriting from Resource class of the flask_restful module used to add data for the created user on the ``CreateUser`` class using the created session id from the CreateUser class.\n
                ``POST``:
                    The post method of AddUserData is used to add user information to the current user and store it on the database.
                    This method exactly add up the data to the recently created user or logged in user, otherwise it cannot perform any action and will abort.
        * ``Login`` - 
                Login class inheriting from Resource class of the flask_restful module used to login the ``user created by normal method`` not by google authenticated method. It can only login the user with data stored on database and the firebase.\n
                ``POST``:
                    The post method of Login class is used to login a particular user by verifying it on the database and the firebase for authentication.

        * ``Logout`` - 
                Logout class inheriting from Resource class of the flask_restful module used to logout a particular user by using the available session id. If there is not session id then it will abort the request.\n
                ``POST``:
                    The post method of Logout class will logout if any users are currently logged in. Which is identified by using the available session id.
                    It basically removes/pops the session id from the cookie so that the particular will get logged out.

        * ``CurrentUser`` -
                CurrentUser class inheriting from Resource class of the flask_restful module used to get all the data of a currently loggedin user, which is identified by using the session id.\n
                ``GET``:
                    This get method of CurrentUser class will return the currently logged in user data from both tables namely ``users`` and ``user_data`` by using the session id called ``created_user_id``, Otherwise will abort the request.
"""

import pdb
from flask_restful import Resource, reqparse, abort, fields, marshal_with
from models import *
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask import jsonify, session # this session will be stored on the server side if we have Server sided session enabled...server_session = Session(app)
from authentication import firebase, auth
from flask import request
from flask_cors import CORS

# # CORS ( Cross-Origin Resource Sharing )
cors = CORS(app, supports_credentials=True)
# cors = CORS()
# cors.init_app(app)

# for password hashing
bcrypt = Bcrypt(app)

# passing our app to the server Session. So, that it will be safe.
# if we don't have the server sided session. Then this session will be the client side session. It could easily be  hacked.
server_session = Session(app)

create_user_req = reqparse.RequestParser()
create_user_req.add_argument(
    'email', type=str, required=True, help='Email is required.')
create_user_req.add_argument(
    'fullname', type=str, required=True, help='Full name is needed.')
create_user_req.add_argument(
    'password', type=str, required=True, help='password is required.')

add_user_data_req = reqparse.RequestParser()
add_user_data_req.add_argument(
    'username', type=str, required=True, help='Username is needed.')
add_user_data_req.add_argument(
    'userage', type=int, required=True, help='Age is needed.', )
add_user_data_req.add_argument(
    'usercity', type=str, required=True, help='City is needed.')
add_user_data_req.add_argument(
    'usertype', type=str, required=True, help='UserType is needed.')


update_user_req = reqparse.RequestParser()

update_user_req.add_argument('email', type=str)
update_user_req.add_argument('fullname', type=str)
update_user_req.add_argument('password', type=str)

update_user_req.add_argument('username', type=str)
update_user_req.add_argument('userage', type=int)
update_user_req.add_argument('usercity', type=str)
update_user_req.add_argument('usertype', type=str)


user_login_req = reqparse.RequestParser()
# user_login_req.add_argument('username', type=str, required=True, help='Username is needed.', )
user_login_req.add_argument(
    'email', type=str, required=True, help='Email is needed.', )
user_login_req.add_argument(
    'password', type=str, required=True, help='Password is Required.', )


create_user_field = {
    'id': fields.String,
    'email': fields.String,
    'fullname': fields.String,
    'password': fields.String,
}

add_user_data_field = {
    'id': fields.String,
    'username': fields.String,
    'userage': fields.Integer,
    'usercity': fields.String,
    'usertype': fields.String
}


class ReactGoogleSignin(Resource):
    """
    ReactGoogleSignin class inheriting from Resource class of the flask_restful module will  used to create a user with google authenticated data coming from react application on the frontend.\n
    It will Create a user if not registered or Logs In the user if already registered by using the post method.
    """

    def post(self):
        """The Post method of class ReactGoogleSignin will get the user information like email, fullname, google_id from the frontend react application and stores the data on the database with the if the user data is not there in database, Otherwise it just logs in the user by creating session id called ``created_user_id``.
        
        :return: the user is created or logged in or not
        :rtype: str
        """
        
        # below we are getting the data's directly from the frontend. So inside the []  make sure to type the spelling appropriately to the frontend returned data.
        email = request.json['email']
        fullname = request.json['name']
        google_id = request.json['googleId']
        # or
        # we can do what we did in login class.

        # check_table = db.engine.execute('select * from google_user_data')

        # pdb.set_trace()
        try:
            google_user = Users(
                email=email, fullname=fullname, google_id=google_id)
            db.session.add(google_user)
            db.session.commit()
            session['created_user_id'] = google_user.id
            # pdb.set_trace()
            return 'Google User Created...'
        except:
            # logged_in_user = Users.query.filter_by(id=google_id).first()
            logged_in_user = db.engine.execute(
                f"select * from users where google_id='{google_id}'").first()
            if logged_in_user is None:
                abort(401, message={"Unauthorized user...Not found."})
            else:
                session['created_user_id'] = logged_in_user.id
            # pdb.set_trace()
            return logged_in_user._asdict(), 200


class AllUsers(Resource):
    """
    AllUsers class inheriting from Resource class of the flask_restful module used to get all the available users and users data from the tables ``users`` and ``user_data`` on the database.
    """

    def get(self):
        """The get method of class AllUsers will return all the users and users data stored in the database
        
        :return: list of users and users data with custom structure
        :rtype: [dict, dict]
        """
        
        allusers = Users.query.all()

        users = {}
        for user in allusers:
            users[user.id] = {
                'email': user.email,
                'fullname': user.fullname,
                'google_id': user.google_id if user.google_id != None else None,
                'password': user.password if user.password != None else None
                # 'username' : user.user_data.username if user.user_data != None else None,
                # 'userage' : user.user_data.userage if user.user_data != None else None,
                # 'usercity' : user.user_data.usercity if user.user_data != None else None,
                # 'usertype' : user.user_data.usertype if user.user_data != None else None
            }

        users_data = {}
        for user in allusers:
            users_data[user.id] = {
                'username': user.user_data.username if user.user_data != None else None,
                'userage': user.user_data.userage if user.user_data != None else None,
                'usercity': user.user_data.usercity if user.user_data != None else None,
                'usertype': user.user_data.usertype if user.user_data != None else None
            }

        return ([users, users_data])


class SearchUser(Resource):
    """
    SearchUser class inheriting from Resource class of the flask_restful module needs username of string type from the ``user_data`` to be passed in the url route for performing actions like searching, deleting and updating a particular user.
    The table ``user_data`` should have the username of string type passed as a parameter on the url route to perform all the actions on the methods namely ``get, delete, put``.
    Otherwise the actions will not be performed. 
    """

    def get(self, username):        
        """The get method of SearchUser class will search for the user and returns that user's details in a dictionary format if exist, otherwise it will abort the request with User Not found message.

        :param username: This is the name which is coming from the url route while calling api
        :type username: str

        :return: list of user and user data  
        :rtype: [dict, dict]
        """
        try:
            userdata = db.engine.execute(
                f"select * from user_data where username='{username}'").first()._asdict()
            user = db.engine.execute(
                f"select * from users where id='{userdata['users_id']}'").first()._asdict()
        except:
            abort(404, message='User Not Found.')

        return ([user, userdata])

    def delete(self, username):
        """The delete method of SearchUser class will delete the particular user and particular user's data if the username exist, otherwise abort the request.
        It will not delete when there is session id of currently LoggedIn user. Because we cannot delete when we are already LoggedIn.

        :param username: This is the name which is coming from the url route while calling api
        :type username: str

        :return: the user is deleted or not
        :rtype: str
        """
        # user_delete = UserData.query.filter_by(username=username).first()
        # if user_delete:
        #     db.session.delete(user_delete)
        #     db.session.commit()
        # return 'User is deleted'
        # or
        user_id = session.get("created_user_id")
        user_delete = db.engine.execute(
            f"select * from user_data where username='{username}'").first()
        # pdb.set_trace()
        if user_delete and user_delete['users_id']:
            if user_id != user_delete['users_id']:
                # because the index 1 is the username field.
                db.session.execute(
                    f"DELETE from user_data where username='{user_delete['username']}'")
                if user_delete.users_id:
                    db.session.execute(
                        f"DELETE from users where id='{user_delete.users_id}'")
                db.session.commit()
            else:
                abort(409, message="Can't delete yourself.")

        elif user_delete:  # to delete the users without havings users_id
            # because the index 1 is the username field.
            db.engine.execute(
                f"DELETE from user_data where username='{user_delete['username']}'")
            return ({"message": "User without having the users_id is deleted successfully."}), 200
        else:
            abort(404, message='User not found to DELETE.')
        return 'User is deleted'

    # @marshal_with(create_user_field )
    # # Instead of the above line we can use .asdict() function or dict() to return in object format.
    def put(self, username: str):
        """The put method of SearchUser class will get the username of string type, if any matching user exist then it can update that particular user's data otherwise it cannot perform action.

        :param username: This is the name which is coming from the url route while calling api
        :type username: str

        :return: list of updated user and updated user data  
        :rtype: [dict, dict]
        """

        parsed_user = update_user_req.parse_args()
        try:
            userdata = db.engine.execute(
                f"select * from user_data where username='{username}'").first()
            user = Users.query.filter_by(id=userdata.users_id).first()
        except:
            abort(
                409, message='User is not there to update (or) No appropriate users found.')
        else:
            user_exist = db.engine.execute(
                f"select * from user_data where username='{parsed_user['username']}'").first()
            email_exist = db.engine.execute(
                f"select * from users where email='{parsed_user['email']}'").first()
            if userdata:
                # pdb.set_trace()
                if user_exist:
                    if userdata['username'] != user_exist['username']:
                        abort(
                            409, message='Username already exist. It must be unique.')
                if email_exist:
                    if user.email != email_exist['email']:
                        abort(409, message='Email already exist. It must be unique.')
            else:  # if user is not there, then...
                abort(401, message='User is not there to update.')

            if not user.google_id:  # We should not update google's data, so...
                if parsed_user['email']:
                    # db.engine.execute(f"""Update users SET
                    # email='{parsed_user['email']}',
                    # fullname='{parsed_user['fullname']}'
                    # where id = '{user.id}'
                    # """)
                    db.engine.execute(
                        f"Update users SET email='{parsed_user['email']}' WHERE id = '{user.id}'")

                if parsed_user['fullname']:
                    db.engine.execute(
                        f"Update users SET fullname='{parsed_user['fullname']}' WHERE id = '{user.id}'")

                if parsed_user['password']:
                    hashed_password = bcrypt.generate_password_hash(
                        f"{parsed_user['password']}").decode('utf-8')
                    db.engine.execute(
                        f"Update users SET password='{hashed_password}' WHERE id = '{user.id}'")

            if user.google_id and (parsed_user['email'] or parsed_user['fullname'] or parsed_user['password']):
                abort(409, message="Cannot update google's data.")

            if parsed_user['username']:
                # db.engine.execute(f"""Update user_data SET
                # username='{parsed_user['username']}',
                # userage='{parsed_user['userage']}',
                # usercity='{parsed_user['usercity']}',
                # usertype='{parsed_user['usertype']}',
                # users_id = '{user.id}'
                # WHERE username='{username}'
                # """)
                db.engine.execute(
                    f"Update user_data SET username='{parsed_user['username']}' WHERE username = '{username}'")

            if parsed_user['userage']:
                db.engine.execute(
                    f"Update user_data SET userage='{parsed_user['userage']}' WHERE username = '{username}'")
            if parsed_user['usercity']:
                db.engine.execute(
                    f"Update user_data SET usercity='{parsed_user['usercity']}' WHERE username = '{username}'")
            if parsed_user['usertype']:
                db.engine.execute(
                    f"Update user_data SET usertype='{parsed_user['usertype']}' WHERE username = '{username}'")

            if not parsed_user['username']:
                updated_data = db.engine.execute(f"select * from user_data where username='{username}'").first()._asdict()
            elif parsed_user['username']:
                updated_data = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()._asdict()
            updated_user = db.engine.execute(f"select * from users where id='{updated_data['users_id']}'").first()._asdict()

            return ([updated_user, updated_data])


class CreateUser(Resource):
    """
    CreateUser class inheriting from Resource class of the flask_restful module used to create a particular user and to store all the data on the ``users`` and  table on the database and on the firebase for later authentication on the ``Login`` class.
    """
    # The below line will help us to convert our python object to look like JSON
    # here the resource fields tells that the returned data's should be in the JSON format...
    # then @marshal_with actually injects that rule in our method.
    @marshal_with(create_user_field)
    def post(self):
        """The post method of the CreateUser class is used to create a user and store it on the database ``users`` table if not exist and on the firebase for email and password login. 

        :return: user details like id and email
        :rtype: dict
        """
        parsed_user = create_user_req.parse_args()
        # user = UserData.query.filter_by(username=parsed_user["username"]).first()
        email_exist = db.engine.execute(
            f"select * from users where email='{parsed_user['email']}'").first()

        # if the email already exists, then
        if email_exist:
            abort(409, message='Email already exist.')

        hashed_password = bcrypt.generate_password_hash(
            f"{parsed_user['password']}").decode('utf-8')

        # add user to firebase
        try:
            register_firebase = auth.create_user_with_email_and_password(
                parsed_user['email'], hashed_password)
        except:
            abort(409, message='''User not created, Try to enter valid entries. PROBLEM CAUSED BY GOOGLE FIREBASE''')

        if parsed_user['email']:
            create_user = Users(
                email=parsed_user['email'], fullname=parsed_user['fullname'], password=hashed_password)
            db.session.add(create_user)
            db.session.commit()
            session['created_user_id'] = create_user.id

        if create_user:
            created_user = db.engine.execute(
                f"select * from users where email='{parsed_user['email']}'").first()

        return created_user


class AddUserData(Resource):
    """
    AddUserData class inheriting from Resource class of the flask_restful module used to add data for the created user on the ``CreateUser`` class using the created session id from the CreateUser class.
    """

    @marshal_with(add_user_data_field)
    def post(self):
        """The post method of AddUserData is used to add user information to the current user and store it on the database.
        This method exactly add up the data to the recently created user or logged in user, otherwise it cannot perform any action and will abort.

        :return: all the data of the created user  
        :rtype: dict
        """
        parsed_user = add_user_data_req.parse_args()
        user_exist = db.engine.execute(
            f"select * from user_data where username='{parsed_user['username']}'").first()

        created_user_id = session.get("created_user_id")
        user_id_exist = db.engine.execute(
            f"select * from user_data where users_id='{created_user_id}'").first()
        # if the username already exists, then
        if user_exist:
            abort(409, message='User already exist with the username.')
        elif user_id_exist:
            abort(409, message='User Data with current user id already exist. Cannot create it again. Try to update it.')

        if parsed_user['username'] and created_user_id:
            create_user_data = UserData(username=parsed_user["username"], userage=parsed_user['userage'],
                                        usercity=parsed_user['usercity'], usertype=parsed_user['usertype'], users_id=created_user_id)
            db.session.add(create_user_data)
            db.session.commit()

            created_user_data = db.engine.execute(
                f"select * from user_data where username='{parsed_user['username']}'").first()

            return created_user_data
        else:
            abort(401, message="No Users are currently created or logged in to add data.")

class Login(Resource):
    """
    Login class inheriting from Resource class of the flask_restful module used to login the ``user created by normal method`` not by google authenticated method. It can only login the user with data stored on database and the firebase.
    """

    def post(self):
        """The post method of Login class is used to login a particular user by verifying it on the database and the firebase for authentication.

        :return: all the data of the logged in user  
        :rtype: dict
        """
        # instead we can use request.json['field_name'] for individual fields.
        parsed_user = user_login_req.parse_args()
        user = db.engine.execute(
            f"select * from users where email='{parsed_user['email']}'").first()
        # pdb.set_trace()
        if user is None:
            abort(404, message='Email Not found or Unauthorized User')
            # or
            # return jsonify({"message": 'Unauthorized User'}), 401

        # means...if not True
        if not bcrypt.check_password_hash(user['password'], parsed_user['password']):
            abort(401, message='Unauthorized User, password not matching.')

        if user:
            try:
                # here simply getting the current user details for using the email to verify because we are not using email for signin. But in firebase we are using email for verfitication. That's why
                login_firebase = auth.sign_in_with_email_and_password(user['email'], user['password'])
                session['created_user_id'] = user.id
            except:
                abort(409, message='problem with Google firebase authentication.')
        if user:
            userdata = db.engine.execute(
                f"select * from user_data where users_id='{user.id}'").first()
            if userdata:
                return ([user._asdict(), userdata._asdict()])
            else:
                return user._asdict()


class Logout(Resource):
    """
    Logout class inheriting from Resource class of the flask_restful module used to logout a particular user by using the available session id. If there is not session id then it will abort the request.
    """

    def post(self):
        """The post method of Logout class will logout if any users are currently logged in. Which is identified by using the available session id.
        It basically removes/pops the session id from the cookie so that the particular will get logged out.
        
        :return: logged out or not
        :rtype: str
        """
        try:
            session.pop("created_user_id")
        except:
            abort(401, message='No user found with the Session ID.')

        return {'message': 'Successfully logged out'}, 200


class CurrentUser(Resource):
    """
    CurrentUser class inheriting from Resource class of the flask_restful module used to get all the data of a currently loggedin user, which is identified by using the session id.
    """

    def get(self):
        """This get method of CurrentUser class will return the currently logged in user data from both tables namely ``users`` and ``user_data`` by using the session id called ``created_user_id``, Otherwise will abort the request.
        
        :return: the currently logged in user data
        :rtype: dict
        """
        user_id = session.get("created_user_id")
        if not user_id:
            abort(401, message='Unauthorized User or No Logged in users.')
            # or
            # return jsonify({'error':"Unauthorized User or No Logged in users."}), 409
        user = db.engine.execute(
            f"select * from users where id='{user_id}'").first()
        userdata = db.engine.execute(
            f"select * from user_data where users_id='{user_id}'").first()
        # pdb.set_trace()
        if userdata and user:
            return ([user._asdict(), userdata._asdict()])
        elif user or userdata:
            if user:
                return ([user._asdict()])
            if userdata:
                return ([userdata._asdict()])
        else:
            return ({"message": "no current users"}), 200


api.add_resource(CreateUser, '/create_user')
api.add_resource(AddUserData, '/add_user_data')
api.add_resource(SearchUser, '/<string:username>')
api.add_resource(AllUsers, '/allusers')

api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CurrentUser, '/current_user')

api.add_resource(ReactGoogleSignin, '/google_signin')

if __name__ == '__main__':
    app.run(debug=True)
