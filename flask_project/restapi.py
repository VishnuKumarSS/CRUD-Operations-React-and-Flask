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
# cors = CORS(app, supports_credentials=True)
cors = CORS()
cors.init_app(app)


# for password hashing 
bcrypt = Bcrypt(app)

# passing our app to the server Session. So, that it will be safe.
server_session = Session(app) # if we don't have the server sided session. Then this session will be the client side session. It could easily be  hacked.


google = oauth.register(
    name='google',
    client_kwargs = {'scope': 'openid email profile'},
    server_metadata_url = "https://accounts.google.com/.well-known/openid-configuration",
)


@app.route('/login/google', methods=["get"])
def login_google():
    redirect_uri = url_for('authorize_google', _external=True)
    resp = oauth.google.authorize_redirect(redirect_uri)
    return resp

@app.route('/authorize/google')
def authorize_google():
    token = oauth.google.authorize_access_token()
    # resp = token['userinfo']
    session['usern'] = token['userinfo']
    # pdb.set_trace()
    return redirect("/userdetails")

@app.route('/userdetails', methods=["GET"])
def userdetails():
    details = session.get('usern')
    return jsonify(details)

@app.route('/logout/google')
def logout_google():
    if session.pop('usern'):
    # return redirect('/login/google')
        return 'User Logged Out'


user_post_req = reqparse.RequestParser()
user_post_req.add_argument('username', type=str, required=True, help='Username is needed.')
user_post_req.add_argument('userage', type=int, required=True, help='Age is needed.', )
user_post_req.add_argument('usercity', type=str, required=True, help='City is needed.')
user_post_req.add_argument('usertype', type=str, required=True, help='UserType is needed.')

# user_post_req.add_argument('uuid', type=str, required=True, help='uuid is needed.')
user_post_req.add_argument('email', type=str, required=True, help='email is required.')
user_post_req.add_argument('password', type=str, required=True, help='password is required.')


user_put_req = reqparse.RequestParser()
user_put_req.add_argument('username', type=str)
user_put_req.add_argument('userage', type=int)
user_put_req.add_argument('usercity', type=str)
user_put_req.add_argument('usertype', type=str)

# user_put_req.add_argument('uuid', type=str)
user_put_req.add_argument('email', type=str)
user_put_req.add_argument('password', type=str)

user_login_req = reqparse.RequestParser()
user_login_req.add_argument('username', type=str, required=True, help='Username is needed.', )
# user_login_req.add_argument('email', type=str, required=True, help='Email is needed.', )
user_login_req.add_argument('password', type=str, required=True, help='Password is Required.', )


resource_fields= {
    'id': fields.Integer,
    'username': fields.String, 
    'userage': fields.Integer,
    'usercity': fields.String,
    'usertype': fields.String,

    'uuid': fields.String,
    'email': fields.String,
    'password': fields.String,
}
# class ReactGoogleSignin(Resource, strict_slashes = False):
class ReactGoogleSignin(Resource):
    def post(self):
        email = request.json['email']
        fullname = request.json['name']
        google_id = request.json['googleId']
        # firstname = request.json['firstname']
        # lastname = request.json['lastname']

        check_table = db.engine.execute('select * from google_user_data')
        # pdb.set_trace()
        # if check_table:
        # for i in check_table:
            # if i.google_id != google_id:
        try:
            google_user = GoogleUserData(email=email, fullname=fullname, google_id=google_id)
            db.session.add(google_user)
            db.session.commit()
            return 'Google User Created.....'
        except:
            return 'User already exist in Database....'


class AllUsers(Resource):
    def get(self):
        # allusers = UserData.query.all()
        allusers = db.engine.execute('select * from user_data')
        # here we are converting it to look like JSON using python dictionaries
        users = {}
        # users_list = []
        for user in allusers:
            users[user.id] = {
                "username" : user.username,
                "userage": user.userage,
                "usercity": user.usercity,
                "usertype": user.usertype,
                "email": user.email,
                "uuid": user.uuid
                # "password": user.password
            } 
            # users_list.append(user.username)
        # pdb.set_trace()
        # return ([users, users_list])
        return (users)
        # Here, above users will be an object consists of key and values as username, userage, usercity.
        # above the users_list will consist of all the user names available.
    
    
class SearchUser(Resource):    
    @marshal_with(resource_fields)
    def get(self, username):
        # parsed_user = user_post_req.parse_args()
        # user = UserData.query.filter_by(username=username).first()
        user = db.engine.execute(f"select * from user_data where username='{username}'").first()
        if not user:
            abort(404, message='User is not there.')
        
        return user
    
    def delete(self, username):
        # user_delete = UserData.query.filter_by(username=username).first()
        # if user_delete: 
        #     db.session.delete(user_delete)
        #     db.session.commit()
        # return 'User is deleted'
        # or
        user_uuid = session.get("user_uuid")
        user_delete = db.engine.execute(f"select * from user_data where username='{username}'").first()

        if user_delete:
            if user_uuid != user_delete['uuid']:
                db.session.execute(f"DELETE from user_data where username='{user_delete['username']}'") # because the index 1 is the username field.
                db.session.commit()
            else:
                abort(409, message="Can't delete yourself")
        else:
            abort(409, message='User not found to DELETE.')
        return 'User is deleted'

    # @marshal_with(resource_fields)
    # # Instead of the above line we can use .asdict() function or dict() to return in object format.  
    def put(self, username):
        parsed_user = user_put_req.parse_args()
        # user = UserData.query.filter_by(username=username).first()
     
        user = db.engine.execute(f"select * from user_data where username='{username}'").first()
        # user_exist = UserData.query.filter_by(username=parsed_user['username']).first()
        user_exist = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()
        email_exist = db.engine.execute(f"select * from user_data where email='{parsed_user['email']}'").first()

        if user:
            # pdb.set_trace()
            if user_exist:
                if user['username'] != user_exist['username']:
                    abort(409, message='Username already exist. It must be unique.')
            if email_exist:
                if user['email'] != email_exist['email']:
                    abort(409, message='Email already exist. It must be unique.')
            # allUsers = UserData.query.all()
            allUsers = db.engine.execute(f"select * from user_data")
        else: # if user is not there, then...
            abort(405, message='User is not there to update.')


        # with password field.
        # hashed_password = bcrypt.generate_password_hash(f"{parsed_user['password']}").decode('utf-8')
        # # pdb.set_trace()
        # db.engine.execute(f"""
        #         UPDATE user_data SET 
        #         username='{parsed_user['username']}', 
        #         userage={parsed_user['userage']}, 
        #         usercity='{parsed_user['usercity']}', 
        #         usertype='{parsed_user['usertype']}',
        #         email='{parsed_user['email']}',
        #         password='{hashed_password}'
        #         WHERE username='{username}'
        #         """)

        #without password field
        db.engine.execute(f"""
            UPDATE user_data SET 
            username='{parsed_user['username']}', 
            userage={parsed_user['userage']}, 
            usercity='{parsed_user['usercity']}', 
            usertype='{parsed_user['usertype']}',
            email='{parsed_user['email']}'
            WHERE username='{username}'
            """)

        updated = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()._asdict()

        return updated
            
class AddUser(Resource):
    # The below line will help us to convert our python object to look like JSON
    # here the resource fields tells that the returned data's should be in the JSON format...
    # then @marshal_with actually injects that rule in our method.
    @marshal_with(resource_fields)
    def post(self):
        parsed_user = user_post_req.parse_args()
        # user = UserData.query.filter_by(username=parsed_user["username"]).first()   
        user_exist = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()     
        email_exist = db.engine.execute(f"select * from user_data where email='{parsed_user['email']}'").first()     
        # if the username already exists, then 
        if user_exist:
            abort(409, message='User already exist.')
        if email_exist:
            abort(409, message='Email already exist.')

        # hashed_password = bcrypt.generate_password_hash(f"{parsed_user['password']}").decode('utf-8')
        hashed_password = bcrypt.generate_password_hash(f"{parsed_user['password']}").decode('utf-8')
        
        # add user to firebase
        try: 
            register_firebase = auth.create_user_with_email_and_password( parsed_user['email'], hashed_password )
        except:
            abort(409, message='''User not created, Try to enter valid entries. PROBLEM CAUSED BY GOOGLE FIREBASE''')
        # pdb.set_trace()

        # to add a user
        newuser = UserData(username=parsed_user["username"], userage=parsed_user['userage'], usercity=parsed_user['usercity'], usertype=parsed_user['usertype'], email=parsed_user['email'], password = hashed_password) #id=parsed_user['id'] , username = username
        db.session.add(newuser)
        db.session.commit()

# here the uuid is set to null...because while creating the models..we have used orm queries...it will work when we convert it to raw queries
        # newuser = db.engine.execute(f"""
        # INSERT into user_data (username, userage, usercity, usertype, email, password) 
        # values(
        # '{parsed_user['username']}', 
        # {parsed_user['userage']}, 
        # '{parsed_user['usercity']}', 
        # '{parsed_user['usertype']}',
        # '{parsed_user['email']}',
        # '{hashed_password}',
        # )""")   

        if newuser:
            created_user = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()

        # session['user_uuid'] = newuser.uuid // to login the created user automatically, instantly

        return created_user

class Login(Resource):
    @marshal_with(resource_fields)
    def post(self):
        parsed_user = user_login_req.parse_args() # instead we can use request.json['field_name'] for individual fields. 
        # user = UserData.query.filter_by(username=parsed_user["username"]).first()   
        user = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()     

        # if the username already exists, then 
        if user is None:
            abort(401, message='Unauthorized User')
            # or
            # return jsonify({"message": 'Unauthorized User'}), 401
        
        if not bcrypt.check_password_hash(user['password'], parsed_user['password']):
            abort(401, message='Unauthorized User, password not matching.') 
            # or
            # return jsonify({"message": 'Unauthorized User, password not matching.'}), 401


        if user:
            try:
                user_details = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()
                # here simply getting the current user details for using the email to verify because we are not using email for signin. But in firebase we are using email for verfitication. That's why
                login_firebase = auth.sign_in_with_email_and_password(user_details['email'], user['password'])

                # here creating a session for logged in user.
                session['user_uuid'] = user['uuid']
            except:
                abort(409, message='problem with Google firebase authentication.')

        return user_details

class Logout(Resource):
    def post(self):

        try:
            session.pop("user_uuid")
        except:
            abort(409, message='No user found with the Session ID.')
   
        return {'message': 'Successfully logged out'}, 200

class CurrentUser(Resource):
    @marshal_with(resource_fields)
    def get(self):
        user_uuid = session.get("user_uuid")
        if not user_uuid:
            abort(401, message='Unauthorized User or No Logged in users.')
            # or
            # return jsonify({'error':"Unauthorized User or No Logged in users."}), 409
        current_user = UserData.query.filter_by(uuid = user_uuid).first()
        return current_user



api.add_resource(AddUser, '/adduser')
api.add_resource(SearchUser, '/<string:username>')
api.add_resource(AllUsers, '/allusers')

api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CurrentUser, '/current_user')
api.add_resource(ReactGoogleSignin, '/google/signin')

if __name__ == '__main__':
    app.run(debug=True)
