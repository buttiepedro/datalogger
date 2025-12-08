from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Mediciones

mediciones_bp = Blueprint("mediciones", __name__)

@mediciones_bp.get("")
def get_mediciones():
    mediciones = Mediciones.query.all()
    data = [
        {
            "id": m.id,
            "id_sensor": m.id_sensor,
            "medicion": m.medicion,
            "timestamp": m.timestamp if hasattr(m, "timestamp") else None
        }
        for m in mediciones
    ]
    return jsonify(data), 200


@mediciones_bp.get("/<int:medicion_id>")
def get_medicion(medicion_id):
    m = Mediciones.query.get(medicion_id)
    if not m:
        return jsonify({"error": "No existe"}), 404

    return jsonify({
        "id": m.id,
        "id_sensor": m.id_sensor,
        "medicion": m.medicion,
        "timestamp": m.timestamp if hasattr(m, "timestamp") else None
    }), 200


@mediciones_bp.post("")
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
