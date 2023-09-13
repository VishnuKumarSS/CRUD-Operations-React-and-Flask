from .app import app
from flask_restful import Api
from .views import CreateUser, AddUserData, SearchUser, AllUsers, Login, Logout, CurrentUser, \
    ReactGoogleSignin


# Initialize Flask-RESTful API
api = Api(app)

api.add_resource(CreateUser, '/create_user')
api.add_resource(AddUserData, '/add_user_data')
api.add_resource(SearchUser, '/<string:username>')
api.add_resource(AllUsers, '/allusers')

api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CurrentUser, '/current_user')

api.add_resource(ReactGoogleSignin, '/google_signin')