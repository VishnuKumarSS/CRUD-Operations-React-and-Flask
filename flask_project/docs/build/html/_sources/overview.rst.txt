Vishnu - User Management Admin Dashboard
========================================

User Management dashboard with Google signup/signin and Custom user registration with Session and Firebase authentication.

LoggedIn Users can see the data in dashboard, But only the authenticated superuser and admin's will see the option to update, delete or manage the users data. Admins and Superuser can create new users within the dashboard.

Superuser have authority to manage all available registered users.

Features
--------

- Sign in with google
- Search functionality
- Management availability only for the Superuser & Admins
- Edit the data based on the user position
- Firebase and Session authentication at once
- Unit test cases to make sure everything works properly
- Custom user Registration and Signup page on par with google authentication
- Form validation with custom error suggestions based on the backend response

What I've learned
-----------------

- Focused a lot on learning frontend technology React JS
- Learnt to write unit test cases for best practices as a developer
- Learnt the Firebase authentication
- Integration process of Frontend & Backend
- Creating & Managing the request and response of Apis
- Creating documentation using sphinx by reStructuredText syntax 
- And much more...

Api Documentation using Sphinx
------------------------------
To create the documentation using Sphinx:

Refer the `Sphinx documentation <https://www.sphinx-doc.org/en/master/tutorial/getting-started.html>`_ to get started with.

.. code-block:: bash

    # Build HTML page using the below command
    $ sphinx-build -b html -E flask_project/docs/source/ flask_project/docs/build/html

    # -b tells Sphinx to build the HTML using HTML Builder
    # -E tells Sphinx to re-run all the source files, which effectively forces a complete rebuild.

Main Technologies
------------------

- Python
- Flask
- HTML
- CSS
- JavaScript
- ReactJS
- Firebase
- Postgresql
- Sphinx
- PyTest

Installation
------------

.. code-block:: bash

    # Clone the repository to your local machine.
    git clone https://github.com/VishnuKumarSS/User-Management-Admin-Dashboard.git

Create & Activate the Virtual Environment for python:

.. code-block:: bash

    # Create the virtual environment
    $ python -m venv flask_project/venv

    # Activate the virtual environment in Windows
    $ source flask_project/venv/Scripts/activate

    # Activate the virtual environment in Linux/Mac
    $ source flask_project/venv/bin/activate

Install the required python packages:

.. code-block:: bash

    $ pip install -r flask_project/requirements.txt

Install the required node dependencies:

.. code-block:: bash

    $ npm install

Run the application
-------------------

Backend:

.. code-block:: bash

    # To start the Backend Flask server in Windows
    $ npm run start-flask-windows

    # To start the Backend Flask server in Linux/Mac
    $ npm run start-flask

Frontend:

.. code-block:: bash

    $ npm start

View the app:

Open http://localhost:3000 (or the address shown in your console) in your web browser to view the app.

Miscellaneous:

.. code-block:: bash

    # Create superuser in windows
    $ npm run flask-createsuperuser-windows

    # Create superuser in Linux/Mac
    $ npm run flask-createsuperuser

    # To get help in creating superuser in Windows
    $ npm run flask-createsuperuser-help-windows

    # To get help in creating superuser in Linux/mac
    $ npm run flask-createsuperuser-help

Run Unit Test Cases
--------------------

.. code-block:: bash

    $ pytest
