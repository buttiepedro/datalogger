from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Mediciones
from flask_jwt_extended import jwt_required
from ..docorators import admin_required

mediciones_bp = Blueprint("mediciones", __name__)
@mediciones_bp.before_request
@jwt_required()
def check_jwt():
  pass

@mediciones_bp.get("/")
def get_mediciones():
    mediciones = Mediciones.query.all()
    return jsonify([m.to_dict() for m in mediciones]), 200



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


@mediciones_bp.post("/")
@admin_required
def add_medicion():
    data = request.json
    m = Mediciones(
        numero_de_serie=data["numero_de_serie"],
        id_sensor=data["id_sensor"], 
        medicion=data["medicion"], 
    )
    db.session.add(m)
    db.session.commit()
    return jsonify({"msg": "Medición creada", "id": m.id})


@mediciones_bp.delete("/<int:medicion_id>")
@admin_required
def delete_medicion(medicion_id):
    m = Mediciones.query.get(medicion_id)
    if not m:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(m)
    db.session.commit()
    return jsonify({"msg": "Medición eliminada"})
