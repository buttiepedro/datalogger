from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Dataloggers
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..docorators import admin_required

dataloggers_bp = Blueprint("dataloggers", __name__)
@dataloggers_bp.before_request
@jwt_required()
def check_jwt():
  pass

@dataloggers_bp.get("/")
def get_sensores():
    claims = get_jwt()
    if claims.get("is_superuser"):
        dataloggers = Dataloggers.query.all()
        return jsonify([d.to_dict() for d in dataloggers]), 200
    empresa=claims["id_empresa"]
    dataloggers = Dataloggers.query.filter_by(id_empresa=empresa).all()
    return jsonify([d.to_dict() for d in dataloggers]), 200


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

@dataloggers_bp.post("/")
@admin_required
def add_sensor():
    claims = get_jwt()
    empresa=claims["id_empresa"]
    data = request.json
    s = Dataloggers(
        id_empresa=empresa,
        nombre=data["nombre"],
        ubicacion=data["ubicacion"],
        numero_de_serie=data["numero_de_serie"]
    )
    db.session.add(s)
    db.session.commit()
    return jsonify({"msg": "Sensor creado", "id": s.id})


@dataloggers_bp.delete("/<int:sensor_id>")
@admin_required
def delete_sensor(sensor_id):
    s = Dataloggers.query.get(sensor_id)
    if not s:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(s)
    db.session.commit()
    return jsonify({"msg": "Sensor eliminado"})
