import pyrebase

config = {
    "apiKey": "AIzaSyD4alSm9Ju4uVCzxZgpUKIIjjwQPf70q8s",
    "authDomain": "auth-flask-e44f4.firebaseapp.com",
    "projectId": "auth-flask-e44f4",
    "storageBucket": "auth-flask-e44f4.appspot.com",
    "messagingSenderId": "340617359930",
    "appId": "1:340617359930:web:77a1fd729bc4e5422b3b03",
    "measurementId": "G-LGE1T2L82F",
    "databaseURL": ""
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
