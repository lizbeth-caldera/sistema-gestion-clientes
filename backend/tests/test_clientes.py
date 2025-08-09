import copy
from .test_validaciones import _get_token, _headers  

# ---------- plantilla válida ----------
DATA_BASE = {
    "razon_social":        "PyTest SA",
    "tipo_persona":        "MORAL",
    "rfc":                 "PYT850101ZZ1",
    "representante_legal": "Ana Test",
    "email":               "test@example.com",
    "telefono":            "555-111-2233"       
}

# ---------- prueba CRUD completo ----------
def test_crud_cliente(client):
    headers = _headers(_get_token(client))

    # --- Alta ---
    data_in = copy.deepcopy(DATA_BASE)
    res = client.post("/clientes", headers=headers, json=data_in)
    assert res.status_code == 201

    # --- Listar ---
    lista = client.get("/clientes", headers=headers).get_json()
    assert any(c["rfc"] == data_in["rfc"] for c in lista)
    cid = next(c["id"] for c in lista if c["rfc"] == data_in["rfc"])

    # --- Update ---
    data_in["email"] = "nuevo@example.com"
    res = client.put(f"/clientes/{cid}", headers=headers, json=data_in)
    assert res.status_code == 200

    # --- Get por id ---
    det = client.get(f"/clientes/{cid}", headers=headers).get_json()
    assert det["email"] == "nuevo@example.com"

    # --- Delete ---
    res = client.delete(f"/clientes/{cid}", headers=headers)
    assert res.status_code == 200

    # --- Verificar ausencia ---
    res = client.get(f"/clientes/{cid}", headers=headers)
    assert res.status_code == 404
