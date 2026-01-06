# 1. Usamos una imagen base "slim". Es mucho más ligera que la imagen por defecto.
# Mantiene lo necesario para correr Python sin herramientas extra innecesarias.
FROM python:3.11-slim

# 2. Variables de entorno para producción
# Evita que Python genere archivos .pyc
ENV PYTHONDONTWRITEBYTECODE=1 
# Asegura que los logs lleguen a la consola de Docker inmediatamente
ENV PYTHONUNBUFFERED=1

# 3. Directorio de trabajo
WORKDIR /app

# 4. Instalación de dependencias del sistema (Opcional)
# Descomenta las siguientes líneas si usas Postgres o librerías que requieran compilación (gcc).
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     gcc \
#     libpq-dev \
#     && rm -rf /var/lib/apt/lists/*

# 5. Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Instalar Gunicorn
# El servidor de desarrollo de Flask NO sirve para producción.
# Gunicorn es un servidor WSGI robusto para producción.
RUN pip install gunicorn

# 7. Crear un usuario no-root por seguridad
# Correr como root es un riesgo de seguridad en producción.
RUN addgroup --system appgroup && adduser --system --group appuser

# 8. Copiar el código de la aplicación
# A diferencia de desarrollo (donde usamos volúmenes), aquí "horneamos" el código dentro de la imagen.
COPY . .

# Cambiamos la propiedad de los archivos al usuario no-root
RUN chown -R appuser:appgroup /app

# 9. Cambiar al usuario limitado
USER appuser

# 10. Comando de ejecución
# Ejecutamos Gunicorn. 
# "app:app" asume que tu archivo principal se llama app.py y la instancia de Flask se llama app.
# Ajusta "workers" según los cores de tu CPU (usualmente 2 * cores + 1).
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "--timeout", "120", "app:app"]