from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Empresas
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..docorators import admin_required, superuser_required

empresas_bp = Blueprint("empresas", __name__)


# Esta línea protege TODAS las rutas que pertenezcan a este blueprint
@empresas_bp.before_request
@jwt_required()
def check_jwt():
  pass

@empresas_bp.get("/")
@admin_required
def get_empresas():
    claims = get_jwt()
    if claims.get("is_superuser"):
        empresas = Empresas.query.all()
        data = [
            {
                "id": e.id,
                "nombre": e.nombre,
                "direccion": e.direccion,
            }
            for e in empresas
        ]
        return jsonify(data), 200
    else:
        empresas = Empresas.query.filter_by(id=claims.get("id_empresa")).all()
        data = [
            {
                "id": e.id,
                "nombre": e.nombre,
                "direccion": e.direccion,
            }
            for e in empresas
        ]
        return jsonify(data), 200

@empresas_bp.post("/")
@superuser_required
def add_empresa():
    data = request.json
    e = Empresas(
        nombre=data["nombre"],
        direccion=data["direccion"],
    )
    db.session.add(e)
    db.session.commit()
    return jsonify({"msg": "Empresa creada", "id": e.id})

@empresas_bp.delete("/<int:empresa_id>")
@superuser_required
def delete_empresa(empresa_id):
  e = Empresas.query.get(empresa_id)
  if not e:
      return jsonify({"error": "No existe"}), 404
  db.session.delete(e)
  db.session.commit()
  return jsonify({"msg": "Empresa eliminada"})


