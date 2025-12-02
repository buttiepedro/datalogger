from flask import Flask
from .config import Config
from .database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar DB
    db.init_app(app)

    # Importar blueprints desde routes/__init__.py
    from .routes import (
        unidades_bp,
        tipo_sensor_bp,
        sensores_bp,
        mediciones_bp
    )

    # Registrar blueprints
    app.register_blueprint(unidades_bp, url_prefix="/unidades")
    app.register_blueprint(tipo_sensor_bp, url_prefix="/tipo_sensor")
    app.register_blueprint(sensores_bp, url_prefix="/sensores")
    app.register_blueprint(mediciones_bp, url_prefix="/mediciones")

    return app
