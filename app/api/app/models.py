from .database import db

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
    unidad_id = db.Column(db.Integer, db.ForeignKey("unidades.id"))
    medicion_min = db.Column(db.Float)
    medicion_max = db.Column(db.Float)

    unidad = db.relationship("Unidades")


class Sensores(db.Model):
    __tablename__ = "sensores"
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, unique=True)  # referencia externa
    nombre = db.Column(db.String)
    ubicacion = db.Column(db.Text)
    tipo_id = db.Column(db.Integer, db.ForeignKey("tipo_sensor.id"))

    tipo = db.relationship("TipoSensor")


class Mediciones(db.Model):
    __tablename__ = "mediciones"
    id = db.Column(db.Integer, primary_key=True)
    id_sensor = db.Column(db.Integer, db.ForeignKey("sensores.id_usuario"))
    medicion = db.Column(db.Integer)

    sensor = db.relationship("Sensores", primaryjoin="Mediciones.id_sensor == Sensores.id_usuario")
