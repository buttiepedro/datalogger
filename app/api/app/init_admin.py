import os
from app import create_app
from app.database import db
from app.models import Usuarios, Empresas
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

jwt = JWTManager()

load_dotenv()

def create_superuser():
    app = create_app()
    with app.app_context():
        # Crear empresa si no existe
        empresa = Empresas.query.filter_by(nombre=os.getenv("ADMIN_COMPANY_NAME")).first()
        if not empresa:
            empresa = Empresas(
                nombre=os.getenv("ADMIN_COMPANY_NAME"),
                direccion="Sistema"
            )
            db.session.add(empresa)
            db.session.commit()
            print("✔ Empresa Administradores creada")

        # Crear superusuario si no existe
        user = Usuarios.query.filter_by(email=os.getenv("SUPERUSER_EMAIL")).first()
        if not user:
            user = Usuarios(
                nombre="superusuario",
                email=os.getenv("SUPERUSER_EMAIL"),
                is_admin=True,
                is_superuser=True,
                empresa=empresa
            )
            user.set_password(os.getenv("SUPERUSER_PASSWORD"))
            db.session.add(user)
            db.session.commit()
            print("✔ Superusuario creado")
        else:
            print("ℹ Superusuario ya existe")

if __name__ == "__main__":
    create_superuser()
