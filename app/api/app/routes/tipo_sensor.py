from flask import Blueprint, request, jsonify
from ..database import db
from ..models import TipoSensor
from ..docorators import superuser_required
from flask_jwt_extended import jwt_required

tipo_sensor_bp = Blueprint("tipo_sensor", __name__)
@tipo_sensor_bp.before_request
@jwt_required()
def check_jwt():
  pass

@tipo_sensor_bp.get("/")
def get_tipos():
    tipos = TipoSensor.query.all()
    if tipos is []:
      return jsonify({"error": "No existen tipos de sensor"}), 404
    return jsonify([t.to_dict() for t in tipos]), 200



@tipo_sensor_bp.get("/<int:tipo_id>")
@superuser_required
def get_tipo(tipo_id):
    t = TipoSensor.query.get(tipo_id)
    if not t:
        return jsonify({"error": "No existe"}), 404

    return jsonify({
        "id": t.id,
        "nombre": t.nombre,
        "descripcion": t.descripcion,
        "id_unidad": t.id_unidad,
        "medicion_min": t.medicion_min,
        "medicion_max": t.medicion_max
    }), 200


@tipo_sensor_bp.post("/")
@superuser_required
def add_tipo():
    data = request.json
    ts = TipoSensor(
        nombre=data["nombre"],
        descripcion=data["descripcion"],
        id_unidad=data["id_unidad"],
        medicion_min=data["medicion_min"],
        medicion_max=data["medicion_max"]
    )
    db.session.add(ts)
    db.session.commit()
    return jsonify({"msg": "TipoSensor creado", "id": ts.id})

@tipo_sensor_bp.delete("/<int:tipo_id>")
@superuser_required
def delete_tipo(tipo_id):
    ts = TipoSensor.query.get(tipo_id)
    if not ts:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(ts)
    db.session.commit()
    return jsonify({"msg": "TipoSensor eliminado"})
