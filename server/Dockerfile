FROM python:3.7-stretch
WORKDIR app
COPY server.py .
COPY cities_data.csv .
RUN pip install flask flask-cors pandas psycopg2
ENTRYPOINT python server.py