from math import ceil
from flask import Blueprint, request, jsonify
from ..database import db
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..models import Sensores
from ..docorators import admin_required
from ..models import Dataloggers
from ..models import Mediciones

sensores_bp = Blueprint("sensores", __name__)

# Esta línea protege TODAS las rutas que pertenezcan a este blueprint
@sensores_bp.before_request
@jwt_required()
def check_jwt():
  pass

@sensores_bp.get("/")
def get_sensores():
  claims = get_jwt()
  if claims.get("is_superuser"):
    sensores = Sensores.query.all()
    return jsonify([s.to_dict() for s in sensores])
  empresa=claims["id_empresa"]
  sensores = Sensores.query.join(Dataloggers).filter(Dataloggers.id_empresa==empresa).all()
  return jsonify([s.to_dict() for s in sensores])

# obtener sensores por datalogger y tambien cual es la ultima medicion de cada sensor
@sensores_bp.get("/<int:id_datalogger>")
def get_sensores_por_datalogger(id_datalogger):
  claims = get_jwt()
  # Si es superusuario, devuelve todos los sensores del datalogger 
  # 1. Recibir parámetros
  page = int(request.args.get('page', 1))
  per_page = int(request.args.get('per_page', 5))

  # 2. Calcular offset y limit
  offset = (page - 1) * per_page
  limit = per_page

  usuario_logeado_id = get_jwt_identity()
  # Paginacion


  if claims.get("is_superuser"):
    total_items = Sensores.query.filter_by(id_datalogger=id_datalogger).count()
    total_pages = ceil(total_items / per_page)
    sensores = Sensores.query.filter_by(id_datalogger=id_datalogger).offset(offset).limit(limit).all()

    resultado = []
    for s in sensores:
      sensor_dict = s.to_dict()
      ultima_medicion = Mediciones.query.filter_by(
        numero_de_serie=s.datalogger.numero_de_serie,
        id_sensor=s.sensor_id
      ).order_by(Mediciones.hora.desc()).first()
      sensor_dict["ultima_medicion"] = ultima_medicion.to_dict() if ultima_medicion else None
      resultado.append(sensor_dict)
    return jsonify({
      "sensores": resultado,
      'pagination': {
        'total_items': total_items,
        'total_pages': total_pages,
        'current_page': page,
        'per_page': per_page
      }})
  
  empresa=claims["id_empresa"]
  total_items = Sensores.query.join(Dataloggers).filter(
    Dataloggers.id_empresa==empresa,
    Sensores.id_datalogger==id_datalogger
  ).count()
  total_pages = ceil(total_items / per_page)
  sensores = Sensores.query.join(Dataloggers).filter(
    Dataloggers.id_empresa==empresa,
    Sensores.id_datalogger==id_datalogger
  ).offset(offset).limit(limit).all()
  resultado = []
  for s in sensores:
    sensor_dict = s.to_dict()
    ultima_medicion = Mediciones.query.filter_by(
      numero_de_serie=s.datalogger.numero_de_serie,
      id_sensor=s.sensor_id
    ).order_by(Mediciones.hora.desc()).first()
    sensor_dict["ultima_medicion"] = ultima_medicion.to_dict() if ultima_medicion else None
    resultado.append(sensor_dict)
  return jsonify({
    "sensores": resultado,  
    'pagination': {
      'total_items': total_items,
      'total_pages': total_pages,
      'current_page': page,
      'per_page': per_page
    }})

@sensores_bp.delete("/<int:sensor_id>")
@jwt_required()
def get_sensor(sensor_id):
  s = Sensores.query.get(sensor_id)
  if not s:
    return jsonify({"error": "No existe"}), 404

  db.session.delete(s)
  db.session.commit()
  return jsonify({"message": "Sensor eliminado"}), 200


@sensores_bp.post("/")
@admin_required
def add_sensor():
  data = request.json
  s = Sensores(
    sensor_id=data["sensor_id"],
    id_datalogger=data["id_datalogger"],
    tipo_sensor=data["tipo_sensor"]
  )
  db.session.add(s)
  db.session.commit()
  return jsonify(s.to_dict()), 201