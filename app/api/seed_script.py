import random
import time
from app.database import db 
from app import create_app
from app.models import Empresas, Usuarios, Unidades, TipoSensor, Dataloggers, Sensores, Mediciones
from datetime import datetime

app = create_app()

def seed_data():
    print("Iniciando carga de datos de prueba...")

    # 1. Crear Unidades (solo si no existen)
    unidades_nombres = ["Celsius", "Humedad Relativa", "Voltaje", "Presión", "Amperaje"]
    unidades = []
    for nombre in unidades_nombres:
        u = Unidades.query.filter_by(nombre=nombre).first()
        if not u:
            u = Unidades(nombre=nombre, booleana=False)
            db.session.add(u)
            db.session.commit() # Commit inmediato para tener el ID
        unidades.append(u)

    # 2. Crear 5 Empresas (solo si no existen)
    for i in range(1, 6):
        nombre_empresa = f"Empresa {i} SA"
        empresa = Empresas.query.filter_by(nombre=nombre_empresa).first()
        
        if not empresa:
            empresa = Empresas(
                nombre=nombre_empresa,
                direccion=f"Calle Falsa {100 + i}, Ciudad {i}"
            )
            db.session.add(empresa)
            db.session.commit()

            # Crear Usuarios solo para empresas nuevas
            admin = Usuarios(
                nombre=f"Admin {i}",
                email=f"admin{i}@empresa{i}.com", 
                is_admin=True,
                is_superuser=False,
                id_empresa=empresa.id
            )
            admin.set_password("admin123")
            db.session.add(admin)

            user = Usuarios(
                nombre=f"User {i}",
                email=f"user{i}@empresa{i}.com",
                is_admin=False,
                is_superuser=False,
                id_empresa=empresa.id
            )
            user.set_password("user123")
            db.session.add(user)

            # 3. Crear Datalogger para la empresa nueva
            dl = Dataloggers(
                nombre=f"DL-{empresa.nombre}",
                ubicacion=f"Planta {i}",
                numero_de_serie=1000 + i, 
                id_empresa=empresa.id
            )
            db.session.add(dl)
            db.session.commit()

    # 4. Crear Tipos de Sensores (evitando duplicados por nombre)
    tipos = []
    for i in range(5):
        nombre_tipo = f"Tipo {i+1}"
        ts = TipoSensor.query.filter_by(nombre=nombre_tipo).first()
        if not ts:
            ts = TipoSensor(
                nombre=nombre_tipo,
                descripcion=f"Descripción del tipo {i+1}",
                id_unidad=unidades[i].id,
                medicion_min=0.0,
                medicion_max=100.0
            )
            db.session.add(ts)
            db.session.commit()
        tipos.append(ts)

    # 5. Crear Sensores solo para dataloggers que NO tengan sensores aún
    dataloggers = Dataloggers.query.all()
    
    # Buscamos el último sensor_id para no repetir IDs manuales
    ultimo_sensor = Sensores.query.order_by(Sensores.sensor_id.desc()).first()
    sensor_counter = (ultimo_sensor.sensor_id + 1) if ultimo_sensor else 1

    for dl in dataloggers:
        # Verificar si el datalogger ya tiene sensores
        sensores_existentes = Sensores.query.filter_by(id_datalogger=dl.id).count()
        
        if sensores_existentes < 2:
            sensores_a_crear = 2 - sensores_existentes
            for _ in range(sensores_a_crear):
                tipo_aleatorio = random.choice(tipos)
                
                nuevo_sensor = Sensores(
                    sensor_id=sensor_counter,
                    id_datalogger=dl.id,
                    tipo_sensor=tipo_aleatorio.id
                )
                db.session.add(nuevo_sensor)
                db.session.commit()

                # 6. Generar mediciones para el sensor nuevo
                mediciones_a_agregar = []
                for j in range(25):
                    m = Mediciones(
                        numero_de_serie=dl.numero_de_serie,
                        id_sensor=nuevo_sensor.sensor_id,
                        medicion=random.uniform(10, 80),
                        hora=datetime.utcnow().replace(
                            hour=random.randint(0, 23), 
                            minute=random.randint(0, 59), 
                            second=random.randint(0, 59)
                        )
                    )
                    mediciones_a_agregar.append(m)
                
                db.session.add_all(mediciones_a_agregar)
                sensor_counter += 1

    db.session.commit()
    print("¡Proceso finalizado! Se omitieron duplicados y se completaron los sensores faltantes.")

if __name__ == "__main__":
    with app.app_context():
        seed_data()