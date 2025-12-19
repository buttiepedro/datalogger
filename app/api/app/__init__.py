from flask import Flask
from .config import Config
from .database import db
from flask_cors import CORS
from flasgger import Swagger
from flask_jwt_extended import JWTManager

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    from .routes.unidades import Unidades
    from .routes.tipo_sensor import TipoSensor
    from .routes.sensores import Sensores
    from .routes.mediciones import Mediciones
    from .routes.usuarios import Usuarios
    from .routes.empresas import Empresas
    from .routes.login import Usuarios
    # ⬇️ CREAR TABLAS
    with app.app_context():
        db.create_all()

    # ----- CORS -----
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

    # ----- SWAGGER -----
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/apispec.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
                "swagger_ui": True
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/"
    }

    Swagger(
        app,
        config=swagger_config,
        template_file="swagger/apispec.json"
    )

    # ----- BLUEPRINTS -----
    from .routes import (
        unidades_bp,
        tipo_sensor_bp,
        sensores_bp,
        mediciones_bp,
        usuarios_bp,
        empresas_bp,
        auth_bp,
    )

    app.register_blueprint(unidades_bp, url_prefix="/unidades")
    app.register_blueprint(tipo_sensor_bp, url_prefix="/tipo_sensor")
    app.register_blueprint(sensores_bp, url_prefix="/sensores")
    app.register_blueprint(mediciones_bp, url_prefix="/mediciones")
    app.register_blueprint(usuarios_bp, url_prefix="/usuarios")
    app.register_blueprint(empresas_bp, url_prefix="/empresas")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
