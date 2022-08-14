from email import message
from flask_restful import Resource, reqparse, abort, fields, marshal_with
from models import *

user_post_req = reqparse.RequestParser()
user_post_req.add_argument('username', type=str, required=True, help='Username is needed.')
user_post_req.add_argument('userage', type=int, required=True, help='Age is needed.', )
user_post_req.add_argument('usercity', type=str, required=True, help='City is needed.')

user_put_req = reqparse.RequestParser()
user_put_req.add_argument('username', type=str)
user_put_req.add_argument('userage', type=int)
user_put_req.add_argument('usercity', type=str)


resource_fields= {
    'id': fields.Integer,
    'username': fields.String, 
    'userage': fields.Integer,
    'usercity': fields.String,
}

class AllUsers(Resource):
    def get(self):
        # allusers = UserData.query.all()
        allusers = db.engine.execute('select * from user_data')
        # here we are converting it to look like JSON using python dictionaries
        users = {}
        users_list = []

        for user in allusers:
            users[user.id] = {
                "username" : user.username,
                "userage": user.userage,
                "usercity": user.usercity,
            } 
            users_list.append(user.username)

        return ([users, users_list])
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
        user_delete = db.engine.execute(f"select * from user_data where username='{username}'").first()
        if user_delete:
            db.session.execute(f"DELETE from user_data where username='{user_delete[1]}'") # because the index 1 is the username field.
            db.session.commit()
        return 'User is deleted'

    # @marshal_with(resource_fields)
    # # Instead of the above line we can use .asdict() function or dict() to return in object format.  
    def put(self, username):
        count = 0
        parsed_user = user_put_req.parse_args()
        # user = UserData.query.filter_by(username=username).first()
        user = db.engine.execute(f"select * from user_data where username='{username}'").first()

        # allUsers = UserData.query.all()
        allUsers = db.engine.execute(f"select * from user_data")
        if not user: # if user is not there, then...
            abort(405, message='User is not there to update.')

        if parsed_user['username']:
            # this loop is to find whether a user already exist or not while updating
            for i in allUsers:
                if parsed_user['username'] != username: # this condition is to neglect the same updating user
                    if i.username == parsed_user['username']:
                        count += 1
            if count>0:
                abort(409, message='Username already exist.')
            else:
                db.engine.execute(f"UPDATE user_data SET username='{parsed_user['username']}', userage={parsed_user['userage']}, usercity='{parsed_user['usercity']}' WHERE username='{username}'")

            updated = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()._asdict()

        return updated

    # @marshal_with(resource_fields)
    # # Instead of the above line we can use .asdict() function or dict() to return in object format.
    # def put(self, username):
    #     count = 0
    #     # parsed user is the text that we are typing in input, and username is the text which is coming from what we are passing in to the url route
    #     parsed_user = user_put_req.parse_args()
    #     # user = UserData.query.filter_by(username=parsed_user["username"]).first()
    #     user = UserData.query.filter_by(username=username).first()

    #     allUsers = UserData.query.all()
    #     if not user: # if user is not there, then...
    #         abort(405, message='User is not there to update.')
    #     # for us in allUsers:
    #     #     if parsed_user['username'] != username: # this condition is to neglect the same updating user
    #     #         if us.username == parsed_user['username']:
    #     #             count += 1
    #     # if count>0:
    #     #     abort(409, message='Username already exist.')

    #     if parsed_user['username']:
    #         # this loop is to find whether a user already exist or not while updating
    #         for i in allUsers:
    #             if parsed_user['username'] != username: # this condition is to neglect the same updating user
    #                 if i.username == parsed_user['username']:
    #                     count += 1
    #         if count>0:
    #             abort(409, message='Username already exist.')
    #         else:
    #             user[1] = parsed_user['username']
    #     if parsed_user['userage']:
    #         user[2] = parsed_user['userage']
    #     if parsed_user['usercity']:
    #         user[3] = parsed_user['usercity']
            
    #     db.session.commit()
    #     return user
            
class AddUser(Resource):
    # The below line will help us to convert our python object to look like JSON
    # here the resource fields tells that the returned data's should be in the JSON format...
    # then @marshal_with actually injects that rule in our method.
    @marshal_with(resource_fields)
    def post(self):
        parsed_user = user_post_req.parse_args()
        # user = UserData.query.filter_by(username=parsed_user["username"]).first()   
        user = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()     
        # if the username already exists, then 
        if user:
            abort(409, message='User already exist.')
        
        # to add a user
        # newuser = UserData(username=parsed_user["username"], userage=parsed_user['userage'], usercity=parsed_user['usercity']) #id=parsed_user['id'] , username = username
        newuser = db.engine.execute(f"INSERT into user_data (username, userage, usercity) values('{parsed_user['username']}', {parsed_user['userage']}, '{parsed_user['usercity']}')") #id=parsed_user['id'] , username = username
        if newuser:
            created_user = db.engine.execute(f"select * from user_data where username='{parsed_user['username']}'").first()
        # db.session.add(newuser)
        # db.session.commit()
        return created_user


api.add_resource(AddUser, '/adduser')
api.add_resource(SearchUser, '/<string:username>')

api.add_resource(AllUsers, '/allusers')
# api.add_resource(User, '/user/<string:username>')

if __name__ == '__main__':
    app.run(debug=True)
