import pdb
from flask_restful import Resource, reqparse, abort, fields, marshal_with
from models import *
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask import jsonify, session # this session will be stored on the server side if we have Server sided session enabled...server_session = Session(app)
from authentication import firebase, auth
from authlib.integrations.flask_client import OAuth
from flask import url_for, render_template, redirect, url_for, request
from flask_cors import CORS

# direct google signin dependencies
oauth = OAuth(app)
app.config['GOOGLE_CLIENT_ID'] = "830332678302-3qsfcmb0b2f0ru15bpfeaqimhjph25qa.apps.googleusercontent.com"
app.config['GOOGLE_CLIENT_SECRET'] = "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"

# # CORS ( Cross-Origin Resource Sharing )
cors = CORS(app, supports_credentials=True)
# cors = CORS()
# cors.init_app(app)


# for password hashing 
bcrypt = Bcrypt(app)

# passing our app to the server Session. So, that it will be safe.
server_session = Session(app) # if we don't have the server sided session. Then this session will be the client side session. It could easily be  hacked.


# google = oauth.register(
#     name='google',
#     client_kwargs = {'scope': 'openid email profile'},
#     server_metadata_url = "https://accounts.google.com/.well-known/openid-configuration",
# )

# @app.route('/login/google', methods=["get"])
# def login_google():
#     redirect_uri = url_for('authorize_google', _external=True)
#     resp = oauth.google.authorize_redirect(redirect_uri)
#     return resp

# @app.route('/authorize/google')
# def authorize_google():
#     token = oauth.google.authorize_access_token()
#     # resp = token['userinfo']
#     session['usern'] = token['userinfo']
#     # pdb.set_trace()
#     return redirect("/userdetails")

# @app.route('/userdetails', methods=["GET"])
# def userdetails():
#     details = session.get('usern')
#     return jsonify(details)

# @app.route('/logout/google')
# def logout_google():
#     if session.pop('usern'):
#     # return redirect('/login/google')
#         return 'User Logged Out'


create_user_req = reqparse.RequestParser()
create_user_req.add_argument('email', type=str, required=True, help='Email is required.')
create_user_req.add_argument('fullname', type=str, required=True, help='Full name is needed.')
create_user_req.add_argument('password', type=str, required=True, help='password is required.')

add_user_data_req = reqparse.RequestParser()
add_user_data_req.add_argument('username', type=str, required=True, help='Username is needed.')
add_user_data_req.add_argument('userage', type=int, required=True, help='Age is needed.', )
add_user_data_req.add_argument('usercity', type=str, required=True, help='City is needed.')
add_user_data_req.add_argument('usertype', type=str, required=True, help='UserType is needed.')


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
user_login_req.add_argument('email', type=str, required=True, help='Email is needed.', )
user_login_req.add_argument('password', type=str, required=True, help='Password is Required.', )


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

# class ReactGoogleSignin(Resource, strict_slashes = False):
class ReactGoogleSignin(Resource):
    def post(self):
        # below we are getting the data's directly from the frontend. So inside the []  make sure to type the spelling appropriately to the frontend returned data.
        email = request.json['email'] 
        fullname = request.json['name']
        google_id = request.json['googleId']
        # or 
        # we can do what we did in login class.

        # check_table = db.engine.execute('select * from google_user_data')

        # pdb.set_trace()
        try:
            google_user = Users(email=email, fullname=fullname, google_id=google_id)
            db.session.add(google_user)
            db.session.commit()
            session['created_user_id'] = google_user.id
            # pdb.set_trace()
            return 'Google User Created...'
        except:
            # logged_in_user = Users.query.filter_by(id=google_id).first()
            logged_in_user = db.engine.execute(f"select * from users where google_id='{google_id}'").first()
            session['created_user_id'] = logged_in_user.id
            # pdb.set_trace()

            return 'User already exist in Database...'

class AllUsers(Resource):
    def get(self):
        allusers = Users.query.all()

        users = {}
        for user in allusers:
            users[user.id] = {
                'email' : user.email ,
                'fullname' : user.fullname ,
                'google_id' : user.google_id if user.google_id != None else None,
                'password' : user.password if user.password != None else None
                # 'username' : user.user_data.username if user.user_data != None else None,
                # 'userage' : user.user_data.userage if user.user_data != None else None,
                # 'usercity' : user.user_data.usercity if user.user_data != None else None,
                # 'usertype' : user.user_data.usertype if user.user_data != None else None
            }

        users_data = {}
        for user in allusers:
            users_data[user.id] = {
                'username' : user.user_data.username if user.user_data != None else None,
                'userage' : user.user_data.userage if user.user_data != None else None,
                'usercity' : user.user_data.usercity if user.user_data != None else None,
                'usertype' : user.user_data.usertype if user.user_data != None else None
            }

        return ([users, users_data])
    
    
class SearchUser(Resource):
    def get(self, username):
        try:
            userdata = db.engine.execute(f"select * from user_data where username='{username}'").first()._asdict()
            user = db.engine.execute(f"select * from users where id='{userdata['users_id']}'").first()._asdict()
        except:
            abort(404, message='User Not Found.')

        # resp = {}
        # resp[user.id] = {
        #         'email' : user.email ,
        #         'fullname' : user.fullname,
        #         'google_id' : user.google_id if user.google_id != None else None,
        #         'password' : user.password if user.password != None else None,
        #         'username' : user.user_data.username if user.user_data != None else None,
        #         'userage' : user.user_data.userage if user.user_data != None else None,
        #         'usercity' : user.user_data.usercity if user.user_data != None else None,
        #         'usertype' : user.user_data.usertype if user.user_data != None else None
        # }
        return ([user, userdata])
    
    def delete(self, username):
        # user_delete = UserData.query.filter_by(username=username).first()
        # if user_delete: 
        #     db.session.delete(user_delete)
        #     db.session.commit()
        # return 'User is deleted'
        # or
        user_id = session.get("created_user_id")
        user_delete = db.engine.execute(f"select * from user_data where username='{username}'").first()
        # pdb.set_trace()
        if user_delete and user_delete['users_id']:
            if user_id != user_delete['users_id']:
                db.session.execute(f"DELETE from user_data where username='{user_delete['username']}'") # because the index 1 is the username field.
                if user_delete.users_id:
                    db.session.execute(f"DELETE from users where id='{user_delete.users_id}'")
                db.session.commit()
            else:
                abort(409, message="Can't delete yourself.")

        elif user_delete: # to delete the users without havings users_id
            db.engine.execute(f"DELETE from user_data where username='{user_delete['username']}'") # because the index 1 is the username field.
            return ({"message":"User without having the users_id is deleted successfully."}), 200
        else:
            abort(409, message='User not found to DELETE.')
        return 'User is deleted'

    # @marshal_with(create_user_field )
    # # Instead of the above line we can use .asdict() function or dict() to return in object format.  
    def put(self, username):
        parsed_user = update_user_req.parse_args()
        try:
            userdata = db.engine.execute(f"select * from user_data where username='{username}'").first()
            user = Users.query.filter_by(id=userdata.users_id).first()
        except:
            abort(409, message='User is not there to update (or) No appropriate users found.')
        else:
            user_exist = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()
            email_exist = db.engine.execute(f"select * from users where email='{parsed_user['email']}'").first()
            if userdata:
                # pdb.set_trace()
                if user_exist:
                    if userdata['username'] != user_exist['username']:
                        abort(409, message='Username already exist. It must be unique.')
                if email_exist:
                    if user.email != email_exist['email']:
                        abort(409, message='Email already exist. It must be unique.')
            else: # if user is not there, then...
                abort(405, message='User is not there to update.')

            
            if not user.google_id: # We should not update google's data, so...
                if parsed_user['email']:
                    # db.engine.execute(f"""Update users SET
                    # email='{parsed_user['email']}',
                    # fullname='{parsed_user['fullname']}'
                    # where id = '{user.id}'
                    # """)
                    db.engine.execute(f"Update users SET email='{parsed_user['email']}' WHERE id = '{user.id}'")

                if parsed_user['fullname']:
                    db.engine.execute(f"Update users SET fullname='{parsed_user['fullname']}' WHERE id = '{user.id}'")

                if parsed_user['password']:
                    hashed_password = bcrypt.generate_password_hash(f"{parsed_user['password']}").decode('utf-8')
                    db.engine.execute(f"Update users SET password='{hashed_password}' WHERE id = '{user.id}'")

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
                db.engine.execute(f"Update user_data SET username='{parsed_user['username']}' WHERE username = '{username}'")
            if parsed_user['userage']:
                db.engine.execute(f"Update user_data SET userage='{parsed_user['userage']}' WHERE username = '{username}'")
            if parsed_user['usercity']:
                db.engine.execute(f"Update user_data SET usercity='{parsed_user['usercity']}' WHERE username = '{username}'")
            if parsed_user['usertype']:
                db.engine.execute(f"Update user_data SET usertype='{parsed_user['usertype']}' WHERE username = '{username}'")
              
            updated_data = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()._asdict()
            updated_user = db.engine.execute(f" select * from users where id='{updated_data['users_id']}'").first()._asdict()

            return ([updated_user, updated_data])

class CreateUser(Resource):
    # The below line will help us to convert our python object to look like JSON
    # here the resource fields tells that the returned data's should be in the JSON format...
    # then @marshal_with actually injects that rule in our method.
    @marshal_with(create_user_field)
    def post(self):
        parsed_user = create_user_req.parse_args()
        # user = UserData.query.filter_by(username=parsed_user["username"]).first()   
        email_exist = db.engine.execute(f"select * from users where email='{parsed_user['email']}'").first()   
        
        # if the email already exists, then 
        if email_exist:
            abort(409, message='Email already exist.')

        hashed_password = bcrypt.generate_password_hash(f"{parsed_user['password']}").decode('utf-8')
        
        # add user to firebase
        try:
            register_firebase = auth.create_user_with_email_and_password(parsed_user['email'], hashed_password)
        except:
            abort(409, message='''User not created, Try to enter valid entries. PROBLEM CAUSED BY GOOGLE FIREBASE''')
        
        if parsed_user['email']:
            create_user = Users(email=parsed_user['email'], fullname= parsed_user['fullname'], password = hashed_password)
            db.session.add(create_user)
            db.session.commit()
            session['created_user_id'] = create_user.id

        if create_user:
            created_user = db.engine.execute(f"select * from users where email='{parsed_user['email']}'").first()

        return created_user

class AddUserData(Resource):
    @marshal_with(add_user_data_field)
    def post(self):
        parsed_user = add_user_data_req.parse_args()
        user_exist = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()     
 
        created_user_id = session.get("created_user_id")
        user_id_exist = db.engine.execute(f"select * from user_data where users_id='{created_user_id}'").first()     
        # if the username already exists, then 
        if user_exist:
            abort(409, message='User already exist with the username.')
        elif user_id_exist:
            abort(409, message='User Data with current user id already exist. Cannot create it again. Try to update it.')

        if parsed_user['username'] and created_user_id:
            create_user_data = UserData(username=parsed_user["username"], userage=parsed_user['userage'], usercity=parsed_user['usercity'], usertype=parsed_user['usertype'], users_id= created_user_id) 
            db.session.add(create_user_data)
            db.session.commit() 

            created_user_data = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()

            return created_user_data
        else:
            abort(401, message="No Users are currently created or logged in to add data.")
        
# class Login(Resource):
#     def post(self):
#         parsed_user = user_login_req.parse_args() # instead we can use request.json['field_name'] for individual fields. 
#         userdata = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()     
#         user = db.engine.execute(f"select * from users where id='{userdata.users_id}'").first()
#         # pdb.set_trace()
#         if userdata is None:
#             abort(401, message='Unauthorized User')
#             # or
#             # return jsonify({"message": 'Unauthorized User'}), 401
        
#         if not bcrypt.check_password_hash(user['password'], parsed_user['password']): # means...if not True
#             abort(401, message='Unauthorized User, password not matching.') 

#         if userdata:
#             try:
#                 user_email_password = db.engine.execute(f"select * from users where id='{userdata.users_id}'").first()
#                 # here simply getting the current user details for using the email to verify because we are not using email for signin. But in firebase we are using email for verfitication. That's why
#                 login_firebase = auth.sign_in_with_email_and_password(user_email_password['email'], user_email_password['password'])
#                 session['created_user_id'] = user_email_password.id # or ... user_email_and_password['id']
#             except:
#                 abort(409, message='problem with Google firebase authentication.')

#         return ([user._asdict(), userdata._asdict()])

class Login(Resource):
    def post(self):
        parsed_user = user_login_req.parse_args() # instead we can use request.json['field_name'] for individual fields. 
        user = db.engine.execute(f"select * from users where email='{parsed_user['email']}'").first()
        # pdb.set_trace()
        if user is None:
            abort(401, message='Unauthorized User or Not found.')
            # or
            # return jsonify({"message": 'Unauthorized User'}), 401
        
        if not bcrypt.check_password_hash(user['password'], parsed_user['password']): # means...if not True
            abort(401, message='Unauthorized User, password not matching.') 

        if user:
            try:
                user_email_password = db.engine.execute(f"select * from users where id='{user.id}'").first() # here we also can use the above user object.
                # here simply getting the current user details for using the email to verify because we are not using email for signin. But in firebase we are using email for verfitication. That's why
                login_firebase = auth.sign_in_with_email_and_password(user_email_password['email'], user_email_password['password'])
                session['created_user_id'] = user_email_password.id # or ... user_email_and_password['id']
            except:
                abort(409, message='problem with Google firebase authentication.')
        if user:
            userdata = db.engine.execute(f"select * from user_data where users_id='{user.id}'").first()     
            if userdata:
                return ([user._asdict(), userdata._asdict()])
            else:
                return user._asdict()

class Logout(Resource):
    def post(self):
        try:
            session.pop("created_user_id")
        except:
            abort(409, message='No user found with the Session ID.')
   
        return {'message': 'Successfully logged out'}, 200

class CurrentUser(Resource):
    def get(self):
        user_id = session.get("created_user_id")
        if not user_id:
            abort(401, message='Unauthorized User or No Logged in users.')
            # or
            # return jsonify({'error':"Unauthorized User or No Logged in users."}), 409
        user = db.engine.execute(f"select * from users where id='{user_id}'").first() 
        userdata = db.engine.execute(f"select * from user_data where users_id='{user_id}'").first()
        # pdb.set_trace()
        if userdata and user:
            return ([user._asdict(), userdata._asdict()])
        elif user or userdata:
            if user:
                return([user._asdict()])
            if userdata:
                return([userdata._asdict()])
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