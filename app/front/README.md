# Flask Frontend para Dataloggers

## Requisitos
- Docker & docker-compose (opcional)
- O Python 3.11 con pip si querés correr localmente

## Configuración
1. Copiar `.env.example` a `.env` y ajustar `API_URL` (ej: http://mi-backend:5000).
2. Build & run con Docker:
   - `docker build -t datalogger-frontend .`
   - `docker run --env-file .env -p 8000:8000 datalogger-frontend`
   O con docker-compose:
   - `docker-compose up --build`

## Correr local (sin docker)
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export API_URL=http://localhost:5000
python app.py
