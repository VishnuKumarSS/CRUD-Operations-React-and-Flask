"""This module is only used for creating the superuser from the CLI (Command Line Interface).

This script allows the user to create a superuser for this admin dashboard.

This module requires 'click' be installed within the python environment where we are running this module. 
And also it required custom modules like 'models' and 'restapi' to be imported.

This file can also be imported as a module and contains the following functions:
    * super_user - This function creates a superuser for the admin dashboard application with the id set to 0
"""
from flask_app.createsuperuser import create_super_user

if __name__ == "__main__":
    create_super_user()