import datetime
from app.database import db
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
    is_superuser = db.Column(db.Boolean, default=False)
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
            "is_superuser": self.is_superuser,
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

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "id_unidad": self.unidad.nombre if self.unidad else None,
            "medicion_min": self.medicion_min,
            "medicion_max": self.medicion_max,
        }
    
class Sensores(db.Model):
    __tablename__ = "sensores"
    id = db.Column(db.Integer, primary_key=True)
    sensor_id = db.Column(db.Integer)
    id_datalogger = db.Column(db.Integer, db.ForeignKey("dataloggers.id"))
    tipo_sensor = db.Column(db.Integer, db.ForeignKey("tipo_sensor.id"))

    tipo = db.relationship("TipoSensor")
    datalogger = db.relationship("Dataloggers")

    def to_dict(self):
        return {
            "id": self.id,
            "id_datalogger": self.datalogger.nombre if self.datalogger else None,
            "sensor_id": self.sensor_id,
            "tipo_sensor": self.tipo.nombre if self.tipo else None,
        }

class Dataloggers(db.Model):
    __tablename__ = "dataloggers"
    id = db.Column(db.Integer, primary_key=True)
    id_empresa = db.Column(db.Integer, db.ForeignKey("empresas.id"))
    nombre = db.Column(db.String)
    ubicacion = db.Column(db.Text)
    numero_de_serie = db.Column(db.Integer, unique=True)
    
    empresa = db.relationship("Empresas")

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "ubicacion": self.ubicacion,
            "numero_de_serie": self.numero_de_serie,
            "empresa": self.empresa.nombre if self.empresa else None,
        }

class Mediciones(db.Model):
    __tablename__ = "mediciones"
    id = db.Column(db.Integer, primary_key=True)
    numero_de_serie = db.Column(db.Integer, db.ForeignKey("dataloggers.numero_de_serie"))
    id_sensor = db.Column(db.Integer, db.ForeignKey("sensores.id"))
    medicion = db.Column(db.Integer)

    datalogger = db.relationship("Dataloggers")

    def to_dict(self):
        return {
            "id": self.id,
            "datalogger": self.datalogger.to_dict() if self.datalogger else None,
            "id_sensor": self.id_sensor.to_dict() if self.id_sensor else None,
            "medicion": self.medicion,
        }
