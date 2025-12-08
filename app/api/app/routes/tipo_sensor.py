from flask import Blueprint, request, jsonify
from ..database import db
from ..models import TipoSensor

tipo_sensor_bp = Blueprint("tipo_sensor", __name__)

@tipo_sensor_bp.get("")
def get_tipos():
    tipos = TipoSensor.query.all()
    data = [
        {
            "id": t.id,
            "nombre": t.nombre,
            "descripcion": t.descripcion,
            "unidad_id": t.unidad_id,
            "medicion_min": t.medicion_min,
            "medicion_max": t.medicion_max
        }
        for t in tipos
    ]
    return jsonify(data), 200


@tipo_sensor_bp.get("/<int:tipo_id>")
def get_tipo(tipo_id):
    t = TipoSensor.query.get(tipo_id)
    if not t:
        return jsonify({"error": "No existe"}), 404

    return jsonify({
        "id": t.id,
        "nombre": t.nombre,
        "descripcion": t.descripcion,
        "unidad_id": t.unidad_id,
        "medicion_min": t.medicion_min,
        "medicion_max": t.medicion_max
    }), 200


@tipo_sensor_bp.post("")
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
