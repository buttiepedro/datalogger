from flask import Blueprint, request, jsonify
import datetime
from ..database import db
from ..models import Mediciones
from ..models import Dataloggers
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from ..docorators import admin_required

mediciones_bp = Blueprint("mediciones", __name__)
@mediciones_bp.before_request
@jwt_required()
def check_jwt():
  pass

@mediciones_bp.get("/")
def get_mediciones():
    claims = get_jwt()
    if claims.get("is_superuser"):
        mediciones = Mediciones.query.all()
        return jsonify([m.to_dict() for m in mediciones]), 200
    empresa_id = claims.get("id_empresa")
    numero_de_serie_datalogger = Dataloggers.query.filter_by(id_empresa=empresa_id).all()
    mediciones = Mediciones.query.filter(Mediciones.numero_de_serie.in_(
        [d.numero_de_serie for d in numero_de_serie_datalogger]
    )).all()
    return jsonify([m.to_dict() for m in mediciones]), 200


# obtener todas las mediciones de un sensor por su numero de serie y id_sensor
@mediciones_bp.get("/sensor/<string:numero_de_serie>/<int:id_sensor>")
def get_mediciones_sensor(numero_de_serie, id_sensor):
    claims = get_jwt()
    if not claims.get("is_superuser"):
        empresa_id = claims.get("id_empresa")
        datalogger = Dataloggers.query.filter_by(
            numero_de_serie=numero_de_serie,
            id_empresa=empresa_id
        ).first()
        if not datalogger:
            return jsonify({"error": "No autorizado"}), 403
    mediciones = Mediciones.query.filter_by(
        numero_de_serie=numero_de_serie,
        id_sensor=id_sensor
    ).all()
    return jsonify([m.to_dict() for m in mediciones]), 200




@mediciones_bp.post("/")
@admin_required
def add_medicion():
    data = request.json
    m = Mediciones(
        numero_de_serie=data["numero_de_serie"],
        id_sensor=data["id_sensor"], 
        medicion=data["medicion"], 
        # por default la hora actual
        hora=data.get("hora", datetime.datetime.utcnow())
    )
    db.session.add(m)
    db.session.commit()
    return jsonify({"msg": "Medición agregada", "id": m.id}), 201


@mediciones_bp.delete("/<int:medicion_id>")
@admin_required
def delete_medicion(medicion_id):
    m = Mediciones.query.get(medicion_id)
    if not m:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(m)
    db.session.commit()
    return jsonify({"msg": "Medición eliminada"}), 200
