from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Empresas

empresas_bp = Blueprint("empresas", __name__)

@empresas_bp.get("/")
def get_empresas():
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

@empresas_bp.post("/")
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
def delete_empresa(empresa_id):
  e = Empresas.query.get(empresa_id)
  if not e:
      return jsonify({"error": "No existe"}), 404
  db.session.delete(e)
  db.session.commit()
  return jsonify({"msg": "Empresa eliminada"})


