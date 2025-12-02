from flask import Blueprint, request, jsonify
from ..database import db
from ..models import TipoSensor

tipo_sensor_bp = Blueprint("tipo_sensor", __name__)

@tipo_sensor_bp.post("/")
def add_tipo():
    data = request.json
    ts = TipoSensor(
        nombre=data["nombre"],
        descripcion=data["descripcion"],
        unidad_id=data["unidad_id"],
        medicion_min=data["medicion_min"],
        medicion_max=data["medicion_max"]
    )
    db.session.add(ts)
    db.session.commit()
    return jsonify({"msg": "TipoSensor creado", "id": ts.id})

@tipo_sensor_bp.delete("/<int:tipo_id>")
def delete_tipo(tipo_id):
    ts = TipoSensor.query.get(tipo_id)
    if not ts:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(ts)
    db.session.commit()
    return jsonify({"msg": "TipoSensor eliminado"})
