import click

from models import *
from restapi import *

@click.command()
# @click.option('--count', default=1, help='Number of times to print.')
@click.option('--username', prompt='Enter SuperUser name',
              help='The person to greet.')
@click.option('--userage', prompt='Enter your Age',
              help='This will be the superuser Age.')
@click.option('--usercity', prompt='Enter your City',
              help='This will be the superuser City.')
@click.option('--email', prompt='Enter your Email',
              help='This will be the superuser Email.')
@click.option('--password', prompt='Enter your Password',
              help='This will be the superuser password.')



def super_user(username, userage, usercity, email, password):
    """This function creates a superuser for the application with the id set to 0."""

    db.create_all()
    hashed_password = bcrypt.generate_password_hash(f'{password}').decode('utf-8')
    try:
        newuser = UserData(id=0, username=username, userage=userage, usercity=usercity, usertype="superuser", email=email, password = hashed_password) 
        db.session.add(newuser)
        db.session.commit()
        click.echo('SuperUser Created Successfully.')
    except:
        id = db.engine.execute(f"select * from user_data where id=0").first()
        if id:
            click.echo('Failed to create superuser. Superuser already exists.')
        else:
            click.echo('Failed to create superuser. Enter valid data.')


if __name__ == '__main__':
    super_user()