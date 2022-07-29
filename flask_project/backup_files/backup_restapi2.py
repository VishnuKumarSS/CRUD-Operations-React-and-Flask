from flask import Flask
from flask_restful import Resource, Api, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://starz1:starz1234@localhost/mydatabase"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class UserData(db.Model):
    id = db.Column(db.Integer, primary_key=True) #unique=True
    username = db.Column(db.String(50), nullable=False)
    userage = db.Column(db.Integer, nullable=False)
    usercity = db.Column(db.String(50), nullable=False)
    
    def __str__(self):
        return f"{self.username} - {self.userage} - {self.usercity}"
    
# db.create_all()

user_post_req = reqparse.RequestParser()
# user_post_req.add_argument('id', type=int, required=True, help='Id is needed.')
user_post_req.add_argument('username', type=str, required=True, help='Username is needed.')
user_post_req.add_argument('userage', type=int, required=True, help='Age is needed.')
user_post_req.add_argument('usercity', type=str, required=True, help='City is needed.')

resource_fields= {
    'id': fields.Integer,
    'username': fields.String, 
    'userage': fields.Integer,
    'usercity': fields.String,
}

class AllUsers(Resource):
    def get(self):
        allusers = UserData.query.all()
        # here we are converting it to look like JSON using python dictionaries
        users = {}
        for user in allusers:
            users[user.id] = {
                "username" : user.username,
                "userage": user.userage,
                "usercity": user.usercity,
            } 
            # users[user.username] = {
            #     "id" : user.id,
            #     "userage": user.userage,
            #     "usercity": user.usercity,
            # } 
        return users

class User(Resource):
    @marshal_with(resource_fields)
    def get(self, username):
        user = UserData.query.filter_by(username=username).first()
        if not user:
            abort(404, 'User is not there.')
        return user

    # The below line will help us to convert our python object to look like JSON
    # here the resource fields tells that the returned data's should be in the JSON format...
    # then @marshal_with actually injects that rule in our method.
    @marshal_with(resource_fields)
    def post(self):
        parsed_user = user_post_req.parse_args()
        # user = UserData.query.filter_by(username=username).first()
        # user = UserData.query.filter_by(username=username).first()
        # if the username already exists, then 
        # if user:
        #     abort(409, message='User already exists.')
            
        # to add a user
        newuser = UserData(username=parsed_user["username"], userage=parsed_user['userage'], usercity=parsed_user['usercity']) #id=parsed_user['id'] , username = username
        db.session.add(newuser)
        db.session.commit()
        return newuser


api.add_resource(User, '/user')
# api.add_resource(User, '/user/<string:username>')
api.add_resource(AllUsers, '/allusers')

if __name__ == '__main__':
    app.run(debug=True)
