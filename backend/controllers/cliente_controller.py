from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from MySQLdb import IntegrityError

from db import get_connection
from utils.validators import valid_rfc, valid_email, valid_phone

cliente_bp = Blueprint("cliente", __name__)

# ─────────────────────────── LISTAR TODOS ───────────────────────────── #
@cliente_bp.route("/clientes", methods=["GET"])
@jwt_required()
def listar_clientes():
    conn = get_connection(); cur = conn.cursor()
    cur.callproc("listar_clientes")
    rows = cur.fetchall()
    colnames = [d[0] for d in cur.description]
    result = [dict(zip(colnames, row)) for row in rows]
    cur.close(); conn.close()
    return jsonify(result), 200


# ─────────────────────────── OBTENER POR ID ─────────────────────────── #
@cliente_bp.route("/clientes/<int:_id>", methods=["GET"])
@jwt_required()
def obtener_cliente(_id):
    conn = get_connection(); cur = conn.cursor()
    cur.callproc("obtener_cliente", (_id,))
    row = cur.fetchone()
    colnames = [d[0] for d in cur.description] if row else []
    cur.close(); conn.close()

    if not row:
        return jsonify(msg="Cliente no encontrado"), 404
    return jsonify(dict(zip(colnames, row))), 200


# ─────────────────────────────── ALTA ───────────────────────────────── #
@cliente_bp.route("/clientes", methods=["POST"])
@jwt_required()
def alta_cliente():
    data = request.get_json(silent=True) or {}

    required = ["razon_social", "tipo_persona", "rfc",
                "representante_legal", "email", "telefono"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify(msg=f"Faltan campos: {', '.join(missing)}"), 400

    if not valid_rfc(data["rfc"]):
        return jsonify(msg="RFC inválido"), 400
    if not valid_email(data["email"]):
        return jsonify(msg="Email inválido"), 400
    if not valid_phone(data["telefono"]):
        return jsonify(msg="Teléfono inválido"), 400

    conn = get_connection(); cur = conn.cursor()
    try:
        cur.callproc("alta_cliente", (
            data["razon_social"],
            data["tipo_persona"],
            data["rfc"],
            data["representante_legal"],
            data["email"],
            data["telefono"],
            data.get("documento", None)
        ))
        conn.commit()
    except IntegrityError:
        conn.rollback()
        return jsonify(msg="El RFC ya existe"), 409
    finally:
        cur.close(); conn.close()

    return jsonify(msg="Cliente creado"), 201


# ──────────────────────────── ACTUALIZAR ────────────────────────────── #
@cliente_bp.route("/clientes/<int:_id>", methods=["PUT"])
@jwt_required()
def actualizar_cliente(_id):
    data = request.get_json(silent=True) or {}

    required = ["razon_social", "tipo_persona", "rfc",
                "representante_legal", "email", "telefono"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify(msg=f"Faltan campos: {', '.join(missing)}"), 400

    if not valid_rfc(data["rfc"]):
        return jsonify(msg="RFC inválido"), 400
    if not valid_email(data["email"]):
        return jsonify(msg="Email inválido"), 400
    if not valid_phone(data["telefono"]):
        return jsonify(msg="Teléfono inválido"), 400

    conn = get_connection(); cur = conn.cursor()
    try:
        cur.callproc("editar_cliente", (
            _id,
            data["razon_social"],
            data["tipo_persona"],
            data["rfc"],
            data["representante_legal"],
            data["email"],
            data["telefono"],
            data.get("documento", None)
        ))
        conn.commit()
    except IntegrityError:
        conn.rollback()
        return jsonify(msg="El RFC ya existe"), 409
    finally:
        affected = cur.rowcount
        cur.close(); conn.close()

    if affected == 0:
        return jsonify(msg="Cliente no encontrado"), 404
    return jsonify(msg="Cliente actualizado"), 200


# ───────────────────────────── ELIMINAR ─────────────────────────────── #
@cliente_bp.route("/clientes/<int:_id>", methods=["DELETE"])
@jwt_required()
def borrar_cliente(_id):
    conn = get_connection(); cur = conn.cursor()
    cur.callproc("eliminar_cliente", (_id,))
    conn.commit()
    affected = cur.rowcount
    cur.close(); conn.close()

    if affected == 0:
        return jsonify(msg="Cliente no encontrado"), 404
    return jsonify(msg="Cliente eliminado"), 200
