FROM python:3.11-slim
# تنظیم متغیرهای محیطی
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
# تنظیم working directory
WORKDIR /app
# نصب dependencies سیستمی
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*


# دانلود باینری Tailwind (با retry برای مقابله با قطعی شبکه)
RUN mkdir -p bin && \
    curl -fL --retry 8 --retry-delay 5 --retry-all-errors --connect-timeout 30 \
    https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64 -o bin/tailwindcss && \
    chmod +x bin/tailwindcss


# کپی و نصب requirements
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt



# کپی کد پروژه
COPY . .

# ساخت فایل CSS نهایی از Tailwind
RUN ./bin/tailwindcss -i ./styles/input.css -o ./static/css/output.css --minify

# ساخت دایرکتوری‌های static و media
RUN mkdir -p /app/staticfiles /app/media
# پورت
EXPOSE 8000
# دستور پیش‌فرض
