from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Empresas
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..docorators import admin_required, superuser_required
from math import ceil # Para el cálculo de páginas

empresas_bp = Blueprint("empresas", __name__)


# Esta línea protege TODAS las rutas que pertenezcan a este blueprint
@empresas_bp.before_request
@jwt_required()
def check_jwt():
  pass

@empresas_bp.get("/pagination")
@admin_required
def get_empresas_pagination():
    claims = get_jwt()
    if claims.get("is_superuser"):
        # 1. Recibir parámetros
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        # 2. Calcular offset y limit
        offset = (page - 1) * per_page
        limit = per_page

        # 3. Consultar la base de datos
        # Consulta para obtener el total de items
        total_items = db.session.query(Empresas).count()

        # 4. Calcular metadatos
        total_pages = ceil(total_items / per_page)


        empresas = Empresas.query.offset(offset).limit(limit).all()
        return jsonify({
        "empresas":[e.to_dict() for e in empresas],
        'pagination': {
            'total_items': total_items,
            'total_pages': total_pages,
            'current_page': page,
            'per_page': per_page
        }})
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

@empresas_bp.get("/")
@admin_required
def get_empresas():
    claims = get_jwt()
    if claims.get("is_superuser"):
        empresas = Empresas.query.all()
        return jsonify({
        "empresas":[e.to_dict() for e in empresas]
        })
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


