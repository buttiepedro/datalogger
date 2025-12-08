import os
from flask import Flask, render_template
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="static", template_folder="templates")
API_URL = os.getenv("API_URL", "http://localhost:5000")

@app.context_processor
def inject_api_url():
    # para que templates y JS puedan leer la variable
    return dict(API_URL=API_URL)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/unidades")
def unidades():
    return render_template("unidades.html")

@app.route("/tipo_sensor")
def tipo_sensor():
    return render_template("tipo_sensor.html")

@app.route("/sensores")
def sensores():
    return render_template("sensores.html")

@app.route("/mediciones")
def mediciones():
    return render_template("mediciones.html")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
