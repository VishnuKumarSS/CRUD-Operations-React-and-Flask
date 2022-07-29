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

# users = {
#     "vishnu": {
#         'id':'1',
#         'userage':20,
#         'usercity':'mdu'
#     },
#     "kumar": {
#         'id':'2',
#         'userage':21,
#         'usercity':'chennai',
#     }
# }

user_post_req = reqparse.RequestParser()
user_post_req.add_argument('id', type=int, required=True, help='Id is needed.')
user_post_req.add_argument('userage', type=int, required=True, help='Age is needed.')
user_post_req.add_argument('usercity', type=str, required=True, help='City is needed.')


resource_fields= {
    'username': fields.String, 
    'id': fields.Integer,
    'userage': fields.Integer,
    'usercity': fields.String,
}

class AllUsers(Resource):
    def get(self):
        allusers = UserData.query.all()
        # here we are converting it to look like JSON using python dictionaries
        users = {}
        for user in allusers:
            users[user.username] = {
                "id" : user.id,
                "userage": user.userage,
                "usercity": user.usercity,
            } 
        return users
    
    # def get(self):
    #     return users
        
class User(Resource):
    @marshal_with(resource_fields)
    def get(self, username):
        user = UserData.query.filter_by(username=username).first()
        if not user:
            abort(404, 'User not found')
        return user
    
    # def get(self, username):
    #     return users[username]
    
    # The below line will help us to convert our python object to look like JSON
    # here the resource fields tells that the returned data's should be in the JSON format...
    # then @marshal_with actually injects that rule in our method.
    @marshal_with(resource_fields)
    def post(self):
        parsed_user = user_post_req.parse_args()
        user = UserData.query.filter_by(username=username).first()
        # if the username already exists, then 
        if user:
            abort(409, message='User already exists.')
        
        # to add a user
        newuser = UserData(username = username, id=parsed_user['id'], userage=parsed_user['userage'], usercity=parsed_user['usercity']) 
        db.session.add(newuser)
        db.session.commit()
        return newuser

    # def post(self, username):
    #     parsed_user = user_post_req.parse_args()
    #     if username in users:
    #         abort(409, 'Id is already there.')
            
    #     # here we are gonna append our users to the users....dictionary    
    #     users[username] = {
    #         'id': parsed_user['id'],
    #         'userage': parsed_user['userage'],
    #         'usercity': parsed_user['usercity'],
    #     }
    #     return users[username]

api.add_resource(User, '/user/<string:username>')
api.add_resource(AllUsers, '/allusers')





# class ReturnDetails(Resource):
#     def get(self):
#         dataa = open("details.txt",'r')
#         return jsonify(dataa.read())

#     def post(self): # by doing this python will know the HTTP method...like get post put delete...
#         details_json = request.get_json()
#         return {
#             'details' : details_json
#         }
# api.add_resource(ReturnDetails, '/details')

# if __name__ == '__main__':
#     app.run(debug=True)

# # curl -H "Content-Type: application/json" -X POST -d @details.txt  http://127.0.0.1:5000/details




# from flask import Flask, request
# app = Flask(__name__)
# @app.route('/test', methods=['GET', 'POST'])
# def test():
#     if request.method=='GET':
#         return('<form action="/test" method="post"><input type="input" value="Send" /></form>')

#     elif request.method=='POST':
#         return "OK this is a post method"
#     else:
#         return("ok")

if __name__ == '__main__':
    app.run(debug=True)


# # curl -H "Content-Type: application/json" -X POST -d @details.txt  http://127.0.0.1:5000/details
