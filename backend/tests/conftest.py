import pytest
from app import app as flask_app         
from db import get_connection

@pytest.fixture()
def app():
    flask_app.config.update({
        "TESTING": True
    })
    yield flask_app              

@pytest.fixture()
def client(app):
    return app.test_client()
##---------------Apartado de limpieza de datos-------------#
@pytest.fixture(autouse=True)
def clean_db():
    conn = get_connection(); cur = conn.cursor()
    cur.execute("DELETE FROM clientes")   # tabla queda vacía antes de cada test para pruebas mas rapidas
    conn.commit(); cur.close(); conn.close()
    yield
