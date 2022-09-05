"""This module is only used for creating the superuser from the CLI (Command Line Interface).

This script allows the user to create a superuser for this admin dashboard.

This module requires 'click' be installed within the python environment where we are running this module. 
And also it required custom modules like 'models' and 'restapi' to be imported.

This file can also be imported as a module and contains the following functions:
    * Users - This function creates a superuser for the admin dashboard application with the id set to 0
"""

import click
from models import *
from restapi import *

@click.command()
# @click.option('--count', default=1, help='Number of times to print.')
@click.option('--email', prompt='Enter your Email',
                help='This will be the superuser Email.')
@click.option('--fullname', prompt='Enter fullname for superuser',
                help='The fullname of the superuser.')
@click.option('--password', prompt='Enter your Password',
                help='This will be the superuser password.')
@click.option('--username', prompt='Enter your username',
                help='The username of the superuser.')
@click.option('--userage', prompt='Enter your age',
                help='The age of the superuser.')
@click.option('--usercity', prompt='Enter your city',
                help='The city of the superuser.')

def super_user(email, fullname, password, username, userage, usercity):
    """This function creates a superuser for the admin dashboard application with the id set to 0.
    
    :param email: this is gonna be the email id for the superuser
    :type email: str
    :param fullname: this is gonna be the fullname of the superuser
    :type fullname: str
    :param password: this is gonna be the password of the superuser
    :type password: str
    :param username: this is gonna be the username of the superuser
    :type password: str
    :param username: this is gonna be the userage of the superuser
    :type password: str
    :param username: this is gonna be the usercity of the superuser
    :type password: str

    :return: whether the superuser is created or not
    :rtype: str
    """

    db.create_all()
    hashed_password = bcrypt.generate_password_hash(f'{password}').decode('utf-8')
    try:
        # newuser = UserData(id=0, username=username, userage=userage, usercity=usercity, usertype="superuser", email=email, password = hashed_password) 
        # db.session.add(newuser)
        # db.session.commit()
        register_firebase = auth.create_user_with_email_and_password(email, hashed_password)
        # pdb.set_trace()
        user = Users(id='0', email=email, fullname=fullname, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        userdata = UserData(username=username, userage=userage, usercity=usercity, usertype='superuser', users_id=user.id)
        db.session.add(userdata)
        db.session.commit()
        click.echo('SuperUser Created Successfully.')
    except:
        id = db.engine.execute(f"select * from users where id='0'").first()
        if id:
            click.echo('Failed to create superuser. Superuser already exists.')
        else:
            click.echo('Failed to create superuser. Enter valid data.')


if __name__ == '__main__':
    super_user()

# commands -
# "flask-superuser": "cd flask_project && my-env/bin/python superuser.py",
# "flask-superuser-help": "cd flask_project && my-env/bin/python superuser.py --help",
