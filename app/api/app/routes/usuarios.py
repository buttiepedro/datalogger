from flask import Blueprint, request, jsonify
from ..database import db
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..models import Usuarios
from ..docorators import admin_required

usuarios_bp = Blueprint("usuarios", __name__)

# Esta línea protege TODAS las rutas que pertenezcan a este blueprint
@usuarios_bp.before_request
@jwt_required()
def check_jwt():
  pass

@usuarios_bp.get("/")
@admin_required
def get_usuarios():
  usuario_logeado_id = get_jwt_identity()
  claims = get_jwt()
  id_empresa = claims.get("id_empresa")
  usuarios = Usuarios.query.filter(Usuarios.id_empresa == id_empresa, Usuarios.id != usuario_logeado_id).all()
  return jsonify([u.to_dict() for u in usuarios])

@usuarios_bp.post("/")
@admin_required
def create_usuario():
  data = request.json
  u = Usuarios(
    nombre=data["nombre"],
    email=data["email"],
    is_admin=data.get("is_admin", False),
    id_empresa=data["id_empresa"],
    is_superuser=data.get("is_superuser", True)
  )
  u.set_password(data["password"])
  db.session.add(u)
  db.session.commit()
  return jsonify({"msg": "Usuario creado", "id": u.id}), 201

@usuarios_bp.delete("/<int:usuario_id>")
@admin_required
def delete_usuario(usuario_id):
  u = Usuarios.query.get(usuario_id)
  if not u:
    return jsonify({"error": "No existe"}), 404
  db.session.delete(u)
  db.session.commit()
  return jsonify({"msg": "Usuario eliminado"})











