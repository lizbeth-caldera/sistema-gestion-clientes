import json

def test_login_ok(client):
    res = client.post(
        "/login",
        json={"username": "admin", "password": "admin123"}
    )
    assert res.status_code == 200
    data = res.get_json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_login_bad_credentials(client):
    res = client.post(
        "/login",
        json={"username": "admin", "password": "wrong"}
    )
    assert res.status_code == 401


def test_refresh_token(client):
    tokens = client.post("/login",
        json={"username": "admin", "password": "admin123"}).get_json()

    res = client.post(
        "/refresh",
        headers={"Authorization": f"Bearer {tokens['refresh_token']}"}
    )
    assert res.status_code == 200
    assert "access_token" in res.get_json()
