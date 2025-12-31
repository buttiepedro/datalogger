from flask import Blueprint, request, jsonify
from ..database import db
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..models import Usuarios
from ..docorators import admin_required
from math import ceil # Para el cálculo de páginas

usuarios_bp = Blueprint("usuarios", __name__)

# Esta línea protege TODAS las rutas que pertenezcan a este blueprint
@usuarios_bp.before_request
@jwt_required()
def check_jwt():
  pass

@usuarios_bp.get("/")
@admin_required
def get_usuarios():
  # 1. Recibir parámetros
  page = int(request.args.get('page', 1))
  per_page = int(request.args.get('per_page', 5))

  # 2. Calcular offset y limit
  offset = (page - 1) * per_page
  limit = per_page

  claims = get_jwt()
  usuario_logeado_id = get_jwt_identity()
  # Paginacion
  if claims.get("is_superuser"):
    total_items = db.session.query(Usuarios).count()
    total_pages = ceil(total_items / per_page)
    # Filtro del usuario logeado para que no aparezca en la lista
    usuarios = Usuarios.query.filter( Usuarios.id != usuario_logeado_id).offset(offset).limit(limit).all()
    return jsonify({
    "usuarios":[u.to_dict() for u in usuarios],
    'pagination': {
      'total_items': total_items,
      'total_pages': total_pages,
      'current_page': page,
      'per_page': per_page
    }})
  empresa = claims.get("id_empresa")

  usuarios = Usuarios.query.filter(Usuarios.id_empresa == empresa, Usuarios.id != usuario_logeado_id).offset(offset).limit(limit).all()
  # 3. Consultar la base de datos
  # Consulta para obtener el total de items
  total_items = db.session.query(Usuarios).filter(Usuarios.id_empresa == empresa).count()

  # 4. Calcular metadatos
  total_pages = ceil(total_items / per_page)
  return jsonify({
    "usuarios":[u.to_dict() for u in usuarios],
    'pagination': {
      'total_items': total_items,
      'total_pages': total_pages,
      'current_page': page,
      'per_page': per_page
    }})

@usuarios_bp.post("/")
@admin_required
def create_usuario():
  data = request.json
  claims = get_jwt()

  if claims.get("is_superuser") == True:
    empresa_id = data["id_empresa"]
  else:
    empresa_id = claims.get("id_empresa")
  u = Usuarios(
    nombre=data["nombre"],
    email=data["email"],
    is_admin=data.get("is_admin", False),
    id_empresa=empresa_id,
    is_superuser=data.get("is_superuser", False)
  )
  u.set_password(data["password"])

  if u.email in [user.email for user in Usuarios.query.filter_by(email=u.email).all()]:
    return jsonify({"error": "El email ya existe","state": True}), 400
  
  
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











