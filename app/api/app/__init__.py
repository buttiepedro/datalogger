from flask import Flask
from flasgger import Swagger
from .config import Config
from .database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar DB
    db.init_app(app)

    # Swagger UI
    swagger_config = {
        "headers": [],
        "title": "API Sensores - Documentación",
        "version": "1.0.0",
        "uiversion": 3,
    }

    Swagger(app, config=swagger_config)

    # Importar Blueprints centralizados en routes/__init__.py
    from .routes import (
        unidades_bp,
        tipo_sensor_bp,
        sensores_bp,
        mediciones_bp
    )

    # Registrar rutas
    app.register_blueprint(unidades_bp, url_prefix="/unidades")
    app.register_blueprint(tipo_sensor_bp, url_prefix="/tipo_sensor")
    app.register_blueprint(sensores_bp, url_prefix="/sensores")
    app.register_blueprint(mediciones_bp, url_prefix="/mediciones")

    return app
