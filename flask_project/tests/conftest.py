from flask_app.app import app as app_instance
import pytest

@pytest.fixture()
def app():
    # app = flask_app()
    app_instance.config.update({
        "TESTING": True,
    })

    # other setup can go here
    yield app_instance
    
    # clean up / reset resources here


@pytest.fixture()
def client(app):
    return app_instance.test_client()

@pytest.fixture()
def runner(app):
    return app_instance.test_cli_runner()