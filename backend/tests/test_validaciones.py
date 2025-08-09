"""
Validaciones de entrada para /clientes:
- Campos obligatorios ausentes       → 400
- Formato de RFC / e-mail / teléfono → 400
- RFC duplicado                      → 409
"""

import copy
import uuid
import random
import datetime
import pytest


# ─────────────────────────── helpers ────────────────────────────
def _get_token(client) -> str:
    """Devuelve un access-token válido (usuario admin)."""
    res = client.post(
        "/login",
        json={"username": "admin", "password": "admin123"}
    )
    assert res.status_code == 200
    return res.get_json()["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _rfc_random() -> str:
    """Genera un RFC ‘aleatorio’ válido: 4 letras + fecha + 3 homoclave."""
    letras = ''.join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=4))
    fecha  = datetime.date.today().strftime("%y%m%d")    # YYMMDD
    homo   = ''.join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=3))
    return letras + fecha + homo


# ───────────────────────── plantilla base ───────────────────────
BASE_CLIENTE = {
    "razon_social":        "PyTest SA de CV",
    "tipo_persona":        "MORAL",
    "rfc":                 "PYT850101ZZ1",
    "representante_legal": "Ana Test",
    "email":               "pruebas@example.com",
    "telefono":            "555-111-2233"
}


# ───────────────────────────── tests ─────────────────────────────
def test_faltan_campos(client):
    token = _get_token(client)
    res   = client.post("/clientes", headers=_headers(token), json={})
    assert res.status_code == 400
    assert "Faltan campos" in res.get_json()["msg"]


@pytest.mark.parametrize("rfc", ["ABC123", "1234567890123", "AAAAAAAAAAAAA"])
def test_rfc_invalido(client, rfc):
    token = _get_token(client)
    datos = copy.deepcopy(BASE_CLIENTE)
    datos["rfc"] = rfc
    res = client.post("/clientes", headers=_headers(token), json=datos)
    assert res.status_code == 400
    assert res.get_json()["msg"] == "RFC inválido"


@pytest.mark.parametrize("correo", ["no-arroba.com", "foo@bar", "foo@bar."])
def test_email_invalido(client, correo):
    token = _get_token(client)
    datos = copy.deepcopy(BASE_CLIENTE)
    datos["email"] = correo
    res = client.post("/clientes", headers=_headers(token), json=datos)
    assert res.status_code == 400
    assert res.get_json()["msg"] == "Email inválido"


@pytest.mark.parametrize("phone", ["123", "abc-123-4567", "555-55-555"])
def test_telefono_invalido(client, phone):
    token = _get_token(client)
    datos = copy.deepcopy(BASE_CLIENTE)
    datos["telefono"] = phone
    res = client.post("/clientes", headers=_headers(token), json=datos)
    assert res.status_code == 400
    assert res.get_json()["msg"] == "Teléfono inválido"


def test_rfc_duplicado(client):
    """Primera alta ok; segundo intento con mismo RFC → 409 Conflict."""
    token = _get_token(client)
    hdr   = _headers(token)

    datos = copy.deepcopy(BASE_CLIENTE)
    datos["rfc"] = _rfc_random()         

    # Se realiza prueba de primera alta
    res1 = client.post("/clientes", headers=hdr, json=datos)
    assert res1.status_code == 201

    # Se realiza prueba con el mismo RFC
    res2 = client.post("/clientes", headers=hdr, json=datos)
    assert res2.status_code == 409
    assert res2.get_json()["msg"] == "El RFC ya existe"
