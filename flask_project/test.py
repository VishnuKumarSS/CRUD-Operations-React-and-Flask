from urllib import response
from conftest import client
from restapi import CurrentUser, app
from flask import request, json, session
import pdb
from models import UserData, Users

def test_db_model(app):
    with app.app_context():
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
        # pdb.set_trace()
        return ([users, users_data])


def test_request_allusers(client):
    response = client.get("/allusers")
    # response.json[0]['0'] # for super user
    res = json.loads(response.data.decode('utf-8')) # to convert all the encoded things (i.e) raw datas to proper json formatted data.
    assert type(res[0]) == dict
    assert response.status_code == 200
def test_request_type_allusers(client):
    response = client.get("/allusers")
    assert response.content_type == "application/json"

# def test_request_type_allusers(client):
    # response = client.get("/allusers")
#     assert b'b172f2d7c98c4669896e2fd4a3d04c0c' in response.data == True

def test_request_login(client):
    response = client.post("/login", 
    json={
        "email": "newsuperuser@gmail.com",
        "password": "1234"
        # "picture": (resources / "picture.png").open("rb"),
    })
    with client.session_transaction() as session:
        session['created_user_id'] = '123'
    assert response.status_code == 200
def test_request_type_login(client):
    response = client.get("/login")
    assert response.content_type == "application/json"


def test_request_reactgooglesignin(client):
    response = client.post("/google_signin")
    assert response.status_code == 200
def test_request_type_reactgooglesignin(client):
    response = client.get("/google_signin")
    assert response.content_type == "application/json"


def test_request_createuser(client):
    response = client.post("/create_user", 
    json = {
        "fullname": "mock fullname",
        "email": "mock@email.com",
        "password": "1234"
    })
    # pdb.set_trace()
    res = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200, res['message']
def test_request_type_createuser(client):
    response = client.get("/create_user")
    assert response.content_type == "application/json"


def test_request_adduserdata(client):
    response = client.post("/add_user_data")
    assert response.status_code == 200
def test_request_type_adduserdata(client):
    response = client.get("/add_user_data")
    assert response.content_type == "application/json"


def test_request_searchuser(client):
    response = client.get("/<string>")
    assert response.status_code == 200
def test_request_type_searchuser(client):
    response = client.get("/<string>")
    assert response.content_type == "application/json"


def test_logout_409(client):
    """This should return 409 status code because there is no session id is passed."""
    # getting the db values like users, userdata
    # a = test_db_model(app)
    # with client.session_transaction() as session:
    #     session["created_user_id"] = 'beecf9ccd2474956afe281a24f90b98e'
    #     response = client.post("/logout")
    #     assert response.status_code == 200 , "No users are logged in to logout"
    response = client.post("/logout")
    assert response.status_code == 409

def test_logout_type(client):
    """The the content_type that it's returning should be in application/json"""

    response = client.get("/logout")
    assert response.content_type == "application/json"

def test_current_user_401(client):
    """The status should be 401 because there is no session id passed, so it is unauthorized"""

    response = client.get("/current_user")
    assert response.status_code == 401

def test_current_user_type(client):
    """The the content_type that it's returning should be in application/json"""

    response = client.get("/current_user")
    assert response.content_type == "application/json"

















# or just type the below

# from restapi import app
# import pytest

# @pytest.fixture()
# def client():
#     client = app.test_client()
#     yield client

# class TestSomething:
#     def test_this(self, client):
#         res = client.get('/allusers')
#         assert res.status_code == 200