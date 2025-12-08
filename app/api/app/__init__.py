from flask import Flask
from .config import Config
from .database import db
from flasgger import Swagger
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config.from_object(Config)

    # CORS
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    db.init_app(app)

    # Swagger config
    swagger_config = {
        "headers": [],
        "specs": [{
            "endpoint": "apispec",
            "route": "/apispec.json",
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
            "swagger_ui": True
        }],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/"
    }

    Swagger(app, config=swagger_config, template_file="swagger/apispec.json")

    # Blueprints
    from .routes import unidades_bp, tipo_sensor_bp, sensores_bp, mediciones_bp

    app.register_blueprint(unidades_bp, url_prefix="/unidades")
    app.register_blueprint(tipo_sensor_bp, url_prefix="/tipo_sensor")
    app.register_blueprint(sensores_bp, url_prefix="/sensores")
    app.register_blueprint(mediciones_bp, url_prefix="/mediciones")

    return app
