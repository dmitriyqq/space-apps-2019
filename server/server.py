from flask import Flask, request, redirect, url_for, send_from_directory, jsonify
import pandas as pd
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

cities_data = pd.read_csv('cities_data.csv')
sea_level = pd.read_csv('sea_level.csv', index_col=False)
conn = psycopg2.connect(dbname='postgres',user='postgres',host='localhost',password='mysecretpassword')

print(sea_level.head(4))
levels = sea_level[['year', 'level']]
fields = cities_data[['city','lat', 'lng', 'elevation']]

@app.route('/cities')
def send_cities():
    lst = []
    for i in range(0, len(cities_data)):
        city, lat, lng, elevation = fields.iloc[i]
        lst.append((city, lat, lng, int(elevation)))

    return jsonify({'cities': lst})

@app.route('/cities2')
def send_cities2():
    lst = []
    cur = conn.cursor()
    cur.execute("SELECT id, name, country, elevation, population, ST_X(C.pos::geometry) as lng, ST_Y(C.pos::geometry) as lat FROM public.cities C where population > 400000")
    df = cur.fetchall()
    for row in df:
        id, name, country, elevation, population, lng, lat = row;
        lst.append({
            'id': id,
            'name': name,
            'country': country,
            'elevation': elevation,
            'population': population,
            'lng': lng,
            'lat': lat})
    cur.close()

    return jsonify({'cities': lst})

@app.route('/years')
def send_years():
    lst = []
    for i in range(0, len(sea_level)):
        year, level = levels.iloc[i]
        lst.append({'year': int(year), 'level': level})

    return jsonify({'levels': lst})


app.run()