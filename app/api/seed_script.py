from app.database import db 
from app import create_app
from app.models import Empresas, Usuarios, Unidades, TipoSensor, Dataloggers, Sensores, Mediciones
from datetime import datetime

app = create_app()

def seed_data():
    print("Iniciando carga de datos de prueba...")

    # 1. Crear 5 Unidades
    unidades_nombres = ["Celsius", "Humedad Relativa", "Voltaje", "Presión", "Amperaje"]
    unidades = []
    for nombre in unidades_nombres:
        u = Unidades(nombre=nombre, booleana=False)
        db.session.add(u)
        unidades.append(u)
    db.session.commit()

    # 2. Crear 5 Empresas con 2 Usuarios cada una
    for i in range(1, 6):
        empresa = Empresas(
            nombre=f"Empresa {i} SA",
            direccion=f"Calle Falsa {100 + i}, Ciudad {i}"
        )
        db.session.add(empresa)
        db.session.commit() # Commit para obtener el ID de la empresa

        # Usuario Admin
        admin = Usuarios(
            nombre=f"Admin {i}",
            email=f"admin{i}@empresa{i}.com",
            is_admin=True,
            is_superuser=False,
            id_empresa=empresa.id
        )
        admin.set_password("admin123")
        db.session.add(admin)

        # Usuario Normal
        user = Usuarios(
            nombre=f"User {i}",
            email=f"user{i}@empresa{i}.com",
            is_admin=False,
            is_superuser=False,
            id_empresa=empresa.id
        )
        user.set_password("user123")
        db.session.add(user)

        # 3. Crear 1 Datalogger por empresa (Total 5)
        dl = Dataloggers(
            nombre=f"DL-{empresa.nombre}",
            ubicacion=f"Planta {i}",
            numero_de_serie=1000 + i,
            id_empresa=empresa.id
        )
        db.session.add(dl)
    
    db.session.commit()

    # 4. Crear 5 Tipos de Sensores
    tipos = []
    for i in range(5):
        ts = TipoSensor(
            nombre=f"Tipo {i+1}",
            descripcion=f"Descripción del tipo de sensor {i+1}",
            id_unidad=unidades[i].id,
            medicion_min=0.0,
            medicion_max=100.0
        )
        db.session.add(ts)
        tipos.append(ts)
    db.session.commit()

    # 5. Crear 5 Sensores y 2 Mediciones para cada uno
    dataloggers = Dataloggers.query.all()
    for i in range(5):
        sensor = Sensores(
            sensor_id=i + 1,
            id_datalogger=dataloggers[i].id,
            tipo_sensor=tipos[i].id
        )
        db.session.add(sensor)
        db.session.commit() # Para asegurar que existe el sensor antes de medir

        # 6. 2 Mediciones por sensor
        m1 = Mediciones(
            numero_de_serie=dataloggers[i].numero_de_serie,
            id_sensor=sensor.sensor_id,
            medicion=20 + i
        )
        m2 = Mediciones(
            numero_de_serie=dataloggers[i].numero_de_serie,
            id_sensor=sensor.sensor_id,
            medicion=25 + i
        )
        db.session.add_all([m1, m2])

    db.session.commit()
    print("¡Datos de prueba insertados con éxito!")

if __name__ == "__main__":
    # Esta es la parte clave para solucionar el error
    with app.app_context():
        seed_data()