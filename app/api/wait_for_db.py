import time
import psycopg2
import os

DB_HOST = os.getenv("DB_HOST", "datalog_postgres")
DB_NAME = os.getenv("DB_NAME", "datalog")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "0655084017a371192df3")

while True:
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
        )
        conn.close()
        print("✅ Postgres listo")
        break
    except psycopg2.OperationalError:
        print("⏳ Esperando a Postgres...")
        time.sleep(2)
