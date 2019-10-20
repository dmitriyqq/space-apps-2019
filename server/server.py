from flask import Flask, request, redirect, url_for, send_from_directory, jsonify
import pandas as pd
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# cities_data = pd.read_csv('cities_data.csv')
sea_level = pd.read_csv('sea_level.csv', index_col=False)
conn = psycopg2.connect(dbname='postgres',user='postgres',host='192.168.14.144',password='mysecretpassword')

print(sea_level.head(4))
levels = sea_level[['year', 'level']]
# fields = cities_data[['city','lat', 'lng', 'elevation']]

@app.route('/cities_below_level', methods=['POST'])
def send_cities_in_rect():
    cur = conn.cursor()
    t = request.get_json()
    swlng = t['swlng']
    swlat = t['swlat']
    nelat = t['nelat']
    nelng = t['nelng']
    level = t['level']
    print(((level, swlng, swlat, swlng, nelat, nelng, nelat, nelng, swlat, swlng, swlat)))
    cur.execute("SELECT id, name, country, elevation, population, ST_X(C.pos::geometry) as lng, ST_Y(C.pos::geometry) as lat, (CASE WHEN elevation > %s THEN 0 ELSE 1 END) as destroyed FROM cities C WHERE ST_Contains(ST_GEOMFROMTEXT('SRID=4326;POLYGON((%s %s, %s %s, %s %s, %s %s, %s %s))'), C.pos::geometry) order by population LIMIT 500;", (level, swlng, swlat, swlng, nelat, nelng, nelat, nelng, swlat, swlng, swlat))
    df = cur.fetchall()
    cur.close()
    return return_companies(df)

# @app.route('/cities')
# def send_cities():
    # lst = []
    # for i in range(0, len(cities_data)
    #     city, lat, lng, elevation = fields.iloc[i]
    #     lst.append((city, lat, lng, int(elevation)))

    # return jsonify({'cities': lst})

@app.route('/cities2')
def send_cities2():
    cur = conn.cursor()
    cur.execute("SELECT id, name, country, elevation, population, ST_X(C.pos::geometry) as lng, ST_Y(C.pos::geometry) as lat FROM public.cities C where population > 400000")
    df = cur.fetchall()
    cur.close()
    return return_companies(df)
    

@app.route('/years')
def send_years():
    lst = []
    for i in range(0, len(sea_level)):
        year, level = levels.iloc[i]
        lst.append({'year': int(year), 'level': level})

    return jsonify({'levels': lst})


def return_companies(companies):
    lst = []

    for row in companies:
        id, name, country, elevation, population, lng, lat, destroyed = row
        lst.append({
            'id': id,
            'name': name,
            'country': country,
            'elevation': elevation,
            'population': population,
            'lng': lng,
            'lat': lat,
            'destroyed': destroyed
            })

    return jsonify({'cities': lst})

app.run()