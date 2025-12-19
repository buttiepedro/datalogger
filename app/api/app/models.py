import datetime
from .database import db
from werkzeug.security import generate_password_hash, check_password_hash

class Empresas(db.Model):
    __tablename__ = "empresas"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String)
    direccion = db.Column(db.String)

class Usuarios(db.Model):
    __tablename__ = "usuarios"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean)
    id_empresa = db.Column(db.Integer, db.ForeignKey("empresas.id"))
    
    empresa = db.relationship("Empresas")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "is_admin": self.is_admin,
            "empresa": self.empresa.nombre if self.empresa else None,
        }


class Unidades(db.Model):
    __tablename__ = "unidades"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String)
    booleana = db.Column(db.Boolean)


class TipoSensor(db.Model):
    __tablename__ = "tipo_sensor"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String)
    descripcion = db.Column(db.Text)
    id_unidad = db.Column(db.Integer, db.ForeignKey("unidades.id"))
    medicion_min = db.Column(db.Float)
    medicion_max = db.Column(db.Float)

    unidad = db.relationship("Unidades")


class Sensores(db.Model):
    __tablename__ = "sensores"
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuarios.id"))  # referencia externa
    nombre = db.Column(db.String)
    ubicacion = db.Column(db.Text)
    id_tipo = db.Column(db.Integer, db.ForeignKey("tipo_sensor.id"))

    tipo = db.relationship("TipoSensor")
    usuario = db.relationship("Usuarios")


class Mediciones(db.Model):
    __tablename__ = "mediciones"
    id = db.Column(db.Integer, primary_key=True)
    id_sensor = db.Column(db.Integer, db.ForeignKey("sensores.id"))
    medicion = db.Column(db.Integer)

    sensor = db.relationship("Sensores")
