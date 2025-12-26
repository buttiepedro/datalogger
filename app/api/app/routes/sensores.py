from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Sensores
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..docorators import admin_required

sensores_bp = Blueprint("sensores", __name__)
@sensores_bp.before_request
@jwt_required()
def check_jwt():
  pass

@sensores_bp.get("/")
def get_sensores():
    claims = get_jwt()
    empresa=claims["id_empresa"]
    sensores = Sensores.query.all()
    return jsonify([s.to_dict() for s in sensores])


# @sensores_bp.get("/<int:sensor_id>")
# @jwt_required()
# def get_sensor(sensor_id):
#     s = Sensores.query.get(sensor_id)
#     if not s:
#         return jsonify({"error": "No existe"}), 404

#     return jsonify({
#         "id": s.id,
#         "id_empresa": s.id_empresa,
#         "nombre": s.nombre,
#         "ubicacion": s.ubicacion,
#         "tipo_id": s.tipo_id
#     }), 200

@sensores_bp.post("/")
@admin_required
def add_sensor():
    data = request.json
    s = Sensores(
        id_empresa=data["id_empresa"],
        nombre=data["nombre"],
        ubicacion=data["ubicacion"],
        tipo_id=data["tipo_id"]
    )
    db.session.add(s)
    db.session.commit()
    return jsonify({"msg": "Sensor creado", "id": s.id})


@sensores_bp.delete("/<int:sensor_id>")
@admin_required
def delete_sensor(sensor_id):
    s = Sensores.query.get(sensor_id)
    if not s:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(s)
    db.session.commit()
    return jsonify({"msg": "Sensor eliminado"})
