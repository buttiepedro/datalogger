from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Unidades

unidades_bp = Blueprint("unidades", __name__)

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
