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


def test_allusers_200(client):
    """It should return status code 200 when we have working database. we are just getting data from the db."""
    response = client.get("/allusers")
    # response.json[0]['0'] # for super user
    res = json.loads(response.data.decode('utf-8')) # to convert all the encoded things (i.e) raw datas to proper json formatted data.
    assert type(res[0]) == dict
    assert response.status_code == 200

def test_allusers_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.get("/allusers")
    assert response.content_type == "application/json"

# def test_request_type_allusers(client):
    # response = client.get("/allusers")
#     assert b'b172f2d7c98c4669896e2fd4a3d04c0c' in response.data == True

def test_login_200(client):
    """It should return status code as 200 because we passed email and password correctly that is found in database and firebase."""

    response = client.post("/login", 
    json={
        "email": "newsuperuser@gmail.com",
        "password": "1234"
    })
    # pdb.set_trace()
    res = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200 , res['message']

def test_login_401(client):
    """It should return status code as 200 because we passed all the credentials to login a authenticated user"""
    
    response = client.post("/login", 
    json={
        "email": "newsuperuser@gmail.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_login_404(client):
    """It should return status code as 404 because we passed a wrong email that doesn't exist in database and firebase."""
    
    response = client.post("/login", 
    json={
        "email": "wrongemail@gmail.com",
        "password": "1234"
    })
    assert response.status_code == 404


def test_login_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.get("/login")
    assert response.content_type == "application/json"


def test_google_signin_400(client):
    """It should return status code 400 when we are not passing any json datas."""

    response = client.post("/google_signin")
    assert response.status_code == 400

def test_google_signin_200(client):
    """It should return status code 200 when the user already exist in db and firebase."""

    response = client.post("/google_signin", json={
        "googleId": "118283156761460173814",
        "email": "starzcodetest1@gmail.com",
        "name": "Starz Testing" 
    })
    assert response.status_code == 200

def test_google_signin_401(client):
    """It should return status code 401 when we pass the wrong google id which is not found in the database and firebase."""

    response = client.post("/google_signin", json={
        "googleId": "wrong data",
        "email": "starzcodetest1@gmail.com",
        "name": "Starz Testing" 
    })
    assert response.status_code == 401

def test_google_signin_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.get("/google_signin")
    assert response.content_type == "application/json"

# def test_create_user_200(client):
#     """It should return 200 when we pass the NEW email that is not found in database and firebase."""

#     response = client.post("/create_user", 
#     json = {
#         "fullname": "fullname",
#         "email": "newemail@email.com", # new email
#         "password": "1234"
#     })
#     # pdb.set_trace()
#     res = json.loads(response.data.decode('utf-8'))
#     assert response.status_code == 200, res['message']


def test_create_user_409(client):
    """It should return 409 when we pass the EXISTING email in db and firebase."""

    response = client.post("/create_user", 
    json = {
        "fullname": "unittest fullname",
        "email": "unittestemail@email.com",
        "password": "1234"
    })
    # pdb.set_trace()
    assert response.status_code == 409
    
    
def test_create_user_409_2(client):
    """It should return status code 409 when we pass the invalid email address. Firebase requires valid esmail"""

    response = client.post("/create_user", 
    json = {
        "fullname": "fullname",
        "email": "email@dfjdkfh", # enter valid entries
        "password": "1234"
    })
    # pdb.set_trace()
    res = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 409, res['message']
    
def test_create_user_400(client):
    """It should return status code 400 when we are not passing any json datas."""

    response = client.post("/create_user")
    # pdb.set_trace()
    res = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 400, res['message']
        
def test_create_user_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.get("/create_user")
    assert response.content_type == "application/json"


def test_add_user_data_401(client):
    """It should return status code 401 because we are not passing any session id for the logged in user to add the data."""

    response = client.post("/add_user_data", json = {
        "username" : 'username',
        "userage" : 0,
        "usercity": "usercity",
        "usertype": "uesrtype"
    })
    assert response.status_code == 401

def test_add_user_data_400(client):
    """It should return status code 400 when we pass wrong datatype inside params."""

    response = client.post("/add_user_data", json = {
        "username" : 'username',
        "userage" : "string", # should be num
        "usercity": "usercity",
        "usertype": "usertype"
    })
    assert response.status_code == 400

def test_add_user_data_400_1(client):
    """It should return status code 400 because we are not passing any data like username, userage, etc.."""

    response = client.post("/add_user_data")
    assert response.status_code == 400

def test_add_user_data_type(client):
    """The content_type that it's returning should be in application/json"""
    
    response = client.get("/add_user_data")
    assert response.content_type == "application/json"


def test_logout_401(client):
    """This should return 401 status code because there is no session id is passed."""
    # getting the db values like users, userdata
    # a = test_db_model(app)
    # with client.session_transaction() as session:
    #     session["created_user_id"] = 'beecf9ccd2474956afe281a24f90b98e'
    #     response = client.post("/logout")
    #     assert response.status_code == 200 , "No users are logged in to logout"
    response = client.post("/logout")
    assert response.status_code == 401

def test_logout_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.get("/logout")
    assert response.content_type == "application/json"

def test_current_user_401(client):
    """The status should be 401 because there is no session id passed, so it is unauthorized"""

    response = client.get("/current_user")
    assert response.status_code == 401

def test_current_user_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.get("/current_user")
    assert response.content_type == "application/json"


def test_searchuser_get_200(client):
    """It should return status code 200 when we pass the existing username to search the user."""

    response = client.get("/vishnu")
    assert response.status_code == 200

def test_searchuser_get_404(client):
    """It should return status code 400 when we pass the username that doesn't exist."""

    response = client.get("/dummy_username") # this username not found in db
    assert response.status_code == 404

def test_searchuser_get_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.get("/username")
    assert response.content_type == "application/json"

# def test_searchuser_delete_200(client):
#     """It should return status code 200 when we pass the existing username to delete the user."""
    
#     response = client.delete("/<username_to_delete>")
#     assert response.status_code == 200

def test_searchuser_delete_404(client):
    """It should return status code 404 when we pass the username which doesn't exist in db to delete."""
    
    response = client.delete("/dummy_username") # this username is not found in db
    assert response.status_code == 404

def test_searchuser_delete_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.delete("/dummy_username")
    assert response.content_type == "application/json"

def test_searchuser_put_200(client):
    """It should return status code 200 when we pass the username that is there in db, for updating the user data."""

    # the username below should be in db
    response = client.put("/superuserfullname", json = {
        "usercity": "mnopqrst"
    })
    assert response.status_code == 200

def test_searchuser_put_400(client):
    """It should return status code 400 when we don't pass any json data to update the userdata."""

    # the username below should be in db
    response = client.put("/superuserfullname")
    assert response.status_code == 400

def test_searchuser_put_409(client):
    """It should return status code 409 when we pass the username which doesn't exist in db to update the user data."""

    # the username below should not be exist in db
    response = client.put("/dummy_username", json = {
        "usercity": "mnopqrst"
    })
    assert response.status_code == 409


def test_searchuser_put_type(client):
    """The content_type that it's returning should be in application/json"""

    response = client.put("/dummy_username")
    assert response.content_type == "application/json"







# or just type the below to make the pytest work

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