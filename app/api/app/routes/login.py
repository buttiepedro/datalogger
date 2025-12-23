from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from datetime import timedelta

from ..models import Usuarios

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/login")
def login():
    data = request.get_json()

    # Validación básica
    if not data or "email" not in data or "password" not in data:
        return {"msg": "Datos inválidos"}, 400

    # Buscar usuario
    user = Usuarios.query.filter_by(email=data["email"]).first()

    # Validar credenciales
    if not user or not user.check_password(data["password"]):
        return {"msg": "Credenciales inválidas"}, 401

    # Crear JWT
    token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "is_admin": user.is_admin,
            "id_empresa": user.id_empresa,
            "is_superuser": user.is_superuser,
        },
        expires_delta=timedelta(hours=8)
    )

    return {
        "access_token": token,
        "user": user.to_dict()
    }, 200