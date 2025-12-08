from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Sensores

sensores_bp = Blueprint("sensores", __name__)

@sensores_bp.get("")
def get_sensores():
    sensores = Sensores.query.all()
    data = [
        {
            "id": s.id,
            "id_usuario": s.id_usuario,
            "nombre": s.nombre,
            "ubicacion": s.ubicacion,
            "tipo_id": s.tipo_id
        }
        for s in sensores
    ]
    return jsonify(data), 200


@sensores_bp.get("/<int:sensor_id>")
def get_sensor(sensor_id):
    s = Sensores.query.get(sensor_id)
    if not s:
        return jsonify({"error": "No existe"}), 404

    return jsonify({
        "id": s.id,
        "id_usuario": s.id_usuario,
        "nombre": s.nombre,
        "ubicacion": s.ubicacion,
        "tipo_id": s.tipo_id
    }), 200


@sensores_bp.post("")
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
