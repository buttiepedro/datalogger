from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Sensores

sensores_bp = Blueprint("sensores", __name__)

@sensores_bp.post("/")
def add_sensor():
    data = request.json
    s = Sensores(
        id_usuario=data["id_usuario"],
        nombre=data["nombre"],
        ubicacion=data["ubicacion"],
        tipo_id=data["tipo_id"]
    )
    db.session.add(s)
    db.session.commit()
    return jsonify({"msg": "Sensor creado", "id": s.id})

@sensores_bp.delete("/<int:sensor_id>")
def delete_sensor(sensor_id):
    s = Sensores.query.get(sensor_id)
    if not s:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(s)
    db.session.commit()
    return jsonify({"msg": "Sensor eliminado"})
