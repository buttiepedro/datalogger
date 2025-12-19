from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Usuarios

usuarios_bp = Blueprint("usuarios", __name__)

@usuarios_bp.get("/")
def get_usuarios():
  usuarios = Usuarios.query.all()
  return jsonify([u.to_dict() for u in usuarios])

@usuarios_bp.post("/")
def create_usuario():
  data = request.json
  u = Usuarios(
      nombre=data["nombre"],
      email=data["email"],
      is_admin=data.get("is_admin", False),
      id_empresa=data["id_empresa"]
  )
  u.set_password(data["password"])
  db.session.add(u)
  db.session.commit()
  return jsonify({"msg": "Usuario creado", "id": u.id}), 201

@usuarios_bp.delete("/<int:usuario_id>")
def delete_usuario(usuario_id):
  u = Usuarios.query.get(usuario_id)
  if not u:
      return jsonify({"error": "No existe"}), 404
  db.session.delete(u)
  db.session.commit()
  return jsonify({"msg": "Usuario eliminado"})




