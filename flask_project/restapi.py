"""Restful api created using flask_restful to perform CRUD operations and Login system with authentication.

This script allows the user to perform the Create, Read, Update and Delete operations
using the request methods like POST, GET, PUT, DELETE. 
There are some methods to login and logout the users.

This module consist of several methods to perform CRUD and to login and logout the users.
It requires parameters of string for some methods to perform the appropriate action.

This module requires 'flask', 'flask_restful', 'flask_bcrypt', 'flask_session', 'flask_cors' be 
installed within the python environment where we are running this module.

This file can also be imported as a module and contains the following classes:
    * ReactGoogleSignin - This will create a user if not registered and logs in the user if already registered with the post method.
    * CreateUser - This has one method to create user and store the user data on the database and the firebase.
    * AddUserData - This has one method to add user data and store the user data on the database.
    * SearchUser - SearchUser class will be responsible for searching, deleting, updating a particular user.
    * AllUsers - This has one method that gets the user data
    * Login - This will be responsible for logging in the manually created user.
    * Logout - This has one method to logout user.
    * CurrentUser - This has one method to get the currently logged in user.
"""

from email import message
import pdb
from flask_restful import Resource, reqparse, abort, fields, marshal_with
from models import *
from flask_bcrypt import Bcrypt
from flask_session import Session
# this session will be stored on the server side if we have Server sided session enabled...server_session = Session(app)
from flask import jsonify, session
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
    """This will create a user if not registered and logs in the user if already registered with the post method."""

    def post(self):
        """This method will get the user information like email, fullname, googld_id from the frontend react component and store the data with few conditions.
        
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
    """This has one method that gets the user data"""

    def get(self):
        """This method will return all the users and users data stored in the database
        
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
    """SearchUser class will be responsible for searching, deleting, updating a particular user."""

    def get(self, username):        
        """This will search for the user and returns that user's details in a dictionary format if exist, otherwise it will abort the request with User Not found.

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
        """This will delete the whole user data with the username if exist, otherwise abort the request. If we try to delete the currently logged in user, it will abort. 

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
        """This will get the username, if any matching user exist then it will update that particular user data.

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
    """This has one method to create user and store the user data on the database and the firebase."""
    # The below line will help us to convert our python object to look like JSON
    # here the resource fields tells that the returned data's should be in the JSON format...
    # then @marshal_with actually injects that rule in our method.
    @marshal_with(create_user_field)
    def post(self):
        """This method is used to create a user and store it on the database and the firebase for email and password login. 

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
    """This has one method to add user data and store the user data on the database."""

    @marshal_with(add_user_data_field)
    def post(self):
        """This method is used to add user information to the current user and store it on the database. 

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
    """This will be responsible for logging in the manually created user."""

    def post(self):
        """This method is used to login a particular user by verifying it on the database and the firebase for authentication.

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
    """This has one method to logout user."""

    def post(self):
        """This method will logout if any users are currently logged in by using session id.
        
        :return: logged out or not
        :rtype: str
        """
        try:
            session.pop("created_user_id")
        except:
            abort(401, message='No user found with the Session ID.')

        return {'message': 'Successfully logged out'}, 200


class CurrentUser(Resource):
    """This has one method to get the currently logged in user."""

    def get(self):
        """This method will get the currently logged in user by using the session id and returns the data.
        
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
