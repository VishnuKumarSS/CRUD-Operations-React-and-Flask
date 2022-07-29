from flask import Flask
from flask_restful import Api
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