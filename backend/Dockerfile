# ─────────────────────────────────────────────────────────
# Dockerfile for MyPet FastAPI Backend
# Deploy trên Render Web Service
# ─────────────────────────────────────────────────────────

FROM python:3.10-slim

# Tránh Python tạo .pyc files và buffer output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Cài dependencies hệ thống cần cho psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements trước (tận dụng Docker cache layer)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source code backend
COPY . .

# Tạo thư mục uploads
RUN mkdir -p /app/app/uploads/avatars /app/app/uploads/messages /app/app/uploads/files

# Expose port (Render sẽ map qua biến PORT)
EXPOSE 8080

# Chạy app — Render truyền PORT qua env variable
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
