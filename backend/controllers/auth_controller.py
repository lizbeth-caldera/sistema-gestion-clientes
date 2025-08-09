from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import check_password_hash
from db import get_connection

auth_bp = Blueprint("auth", __name__)
jwt = JWTManager()

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify(msg="Missing credentials"), 400

    conn = get_connection(); cur = conn.cursor()
    cur.execute("SELECT password_hash FROM usuarios WHERE username=%s", (username,))
    row = cur.fetchone(); cur.close(); conn.close()

    if row and check_password_hash(row[0], password):
        access  = create_access_token(identity=username, fresh=True)
        refresh = create_refresh_token(identity=username)
        return jsonify(access_token=access, refresh_token=refresh), 200
    return jsonify(msg="Bad credentials"), 401


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access = create_access_token(identity=identity)
    return jsonify(access_token=new_access), 200
