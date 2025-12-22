from functools import wraps
from flask_jwt_extended import get_jwt
from flask import jsonify

def superuser_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("is_superuser"):
            return fn(*args, **kwargs)
        return jsonify({"msg": "Acceso restringido: Solo Superusuarios"}), 403
    return wrapper

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        # El Superusuario también cuenta como admin para todo
        if claims.get("is_admin") or claims.get("is_superuser"):
            return fn(*args, **kwargs)
        return jsonify({"msg": "Acceso restringido: Se requieren permisos de Admin"}), 403
    return wrapper