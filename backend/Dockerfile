FROM python:3.11-slim

WORKDIR /app

# ───────────── Paquetes de sistema necesarios ─────────────
RUN apt-get update && apt-get install -y \
      build-essential \
      default-libmysqlclient-dev \
      pkg-config \
  && rm -rf /var/lib/apt/lists/*

# ───────────── Dependencias Python ─────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ───────────── Código fuente ─────────────
COPY . .

ENV FLASK_APP=app.py
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]
