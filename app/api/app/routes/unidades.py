from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Unidades

unidades_bp = Blueprint("unidades", __name__)

@unidades_bp.get("/")
def get_unidades():
    unidades = Unidades.query.all()
    data = [
        {"id": u.id, "nombre": u.nombre, "booleana": u.booleana}
        for u in unidades
    ]
    return jsonify(data), 200

@unidades_bp.get("/<int:unidad_id>")
def get_unidad(unidad_id):
    u = Unidades.query.get(unidad_id)
    if not u:
        return jsonify({"error": "No existe"}), 404
    return jsonify({"id": u.id, "nombre": u.nombre, "booleana": u.booleana}), 200


@unidades_bp.post("/")
def add_unidad():
    data = request.json
    u = Unidades(nombre=data["nombre"], booleana=data["booleana"])
    db.session.add(u)
    db.session.commit()
    return jsonify({"msg": "Unidad creada", "id": u.id})

@unidades_bp.delete("/<int:unidad_id>")
def delete_unidad(unidad_id):
    u = Unidades.query.get(unidad_id)
    if not u:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(u)
    db.session.commit()
    return jsonify({"msg": "Unidad eliminada"})
