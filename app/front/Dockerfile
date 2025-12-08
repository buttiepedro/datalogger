# image basada en Python ligera
FROM python:3.11-slim

# variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# trabajo
WORKDIR /app

# instalar dependencias
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# copiar código
COPY . /app

# exponer puerto
EXPOSE 8000

# comando por defecto (gunicorn)
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:8000", "--workers", "2", "--threads", "4"]
