FROM python:3.10

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY config.yaml .
COPY *.py .
EXPOSE 8080
CMD ["uvicorn", "app:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8080"]