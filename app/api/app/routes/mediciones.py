from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Mediciones

mediciones_bp = Blueprint("mediciones", __name__)

@mediciones_bp.post("/")
def add_medicion():
    data = request.json
    m = Mediciones(id_sensor=data["id_sensor"], medicion=data["medicion"])
    db.session.add(m)
    db.session.commit()
    return jsonify({"msg": "Medición creada", "id": m.id})

@mediciones_bp.delete("/<int:medicion_id>")
def delete_medicion(medicion_id):
    m = Mediciones.query.get(medicion_id)
    if not m:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(m)
    db.session.commit()
    return jsonify({"msg": "Medición eliminada"})
