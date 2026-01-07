from math import ceil
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
def get_dataloggers():
    claims = get_jwt()
    # 1. Recibir parámetros
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 5))

    # 2. Calcular offset y limit
    offset = (page - 1) * per_page
    limit = per_page

    if claims.get("is_superuser"):
        total_items = Dataloggers.query.count()
        total_pages = ceil(total_items / per_page)
        dataloggers = Dataloggers.query.offset(offset).limit(limit).all()
        pagination = {
            'total_items': total_items,
            'total_pages': total_pages,
            'current_page': page,
            'per_page': per_page
        }

        return jsonify({
            "dataloggers": [d.to_dict() for d in dataloggers], 
            'pagination': pagination
        }), 200
    
    empresa=claims["id_empresa"]
    total_items = Dataloggers.query.filter_by(id_empresa=empresa).count()
    total_pages = ceil(total_items / per_page)
    dataloggers = Dataloggers.query.filter_by(id_empresa=empresa).offset(offset).limit(limit).all()
    pagination = {
        'total_items': total_items,
        'total_pages': total_pages,
        'current_page': page,
        'per_page': per_page
    }
    return jsonify({
        "dataloggers": [d.to_dict() for d in dataloggers], 
        'pagination': pagination
    }), 200


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
def add_datalogger():
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
    return jsonify({"msg": "Datalogger creado", "id": s.id}) , 201


@dataloggers_bp.delete("/<int:datalogger_id>")
@admin_required
def delete_datalogger(datalogger_id):
    s = Dataloggers.query.get(datalogger_id)
    if not s:
        return jsonify({"error": "No existe"}), 404
    db.session.delete(s)
    db.session.commit()
    return jsonify({"msg": "Datalogger eliminado"})
