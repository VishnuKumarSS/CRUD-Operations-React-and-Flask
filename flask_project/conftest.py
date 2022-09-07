from restapi import app as flask_app
import pytest

@pytest.fixture()
def app():
    # app = flask_app()
    flask_app.config.update({
        "TESTING": True,
    })

    # other setup can go here
    yield flask_app
    
    # clean up / reset resources here


@pytest.fixture()
def client(app):
    return flask_app.test_client()

@pytest.fixture()
def runner(app):
    return flask_app.test_cli_runner()