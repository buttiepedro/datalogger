from flask import Flask
from flasgger import Swagger
from .config import Config
from .database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar DB
    db.init_app(app)

    # Configuración completa para Swagger
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/apispec.json",
                "rule_filter": lambda rule: True,   # incluir todas las rutas
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/",  # ruta principal del front swagger
    }

    swagger_template = {
        "info": {
            "title": "API Sensores",
            "description": "Documentación automática de la API",
            "version": "1.0.0",
        }
    }

    Swagger(app, config=swagger_config, template=swagger_template)

    # Importar Blueprints desde routes/__init__.py
    from .routes import (
        unidades_bp,
        tipo_sensor_bp,
        sensores_bp,
        mediciones_bp
    )

    # Registrar Blueprints
    app.register_blueprint(unidades_bp, url_prefix="/unidades")
    app.register_blueprint(tipo_sensor_bp, url_prefix="/tipo_sensor")
    app.register_blueprint(sensores_bp, url_prefix="/sensores")
    app.register_blueprint(mediciones_bp, url_prefix="/mediciones")

    return app
