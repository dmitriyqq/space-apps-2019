from flask import Flask, request, redirect, url_for, send_from_directory, jsonify
import pandas as pd
import psycopg2
import math

from json import load
from os.path import abspath
from os.path import join as path_join
from os.path import split as path_split
config = load(open(abspath(path_join(path_split(__file__)[0], 'config.json'))))

app = Flask(__name__)
app

# cities_data = pd.read_csv('cities_data.csv')
# sea_level = pd.read_csv('sea_level.csv', index_col=False)
conn = psycopg2.connect(dbname=config['dbname'],user=config['user'],host=config['host'],password=config['pwd'])


def check_data():
    app.logger.info('Checking data')
    with conn.cursor() as cur:
        try:
            cur.execute("Select * from public.cities limit 1")
            data = cur.fetchone()
            if (data):
                app.logger.info('Data already loaded')
                return True
            else:
                app.logger.info('no table')
                load_data()
                return False
        except:
            app.logger.info('no table')
            load_data()
            return False

    return True

def load_data(): 
    data = pd.read_csv('cities_data.csv')
    app.logger.info("Started loading data")

    with conn.cursor() as cur:
        cur.execute("""
            rollback;
            CREATE TABLE public.cities 
            (id serial PRIMARY KEY NOT NULL,
             name VARCHAR(255),
             country VARCHAR(255),
             pos geography(POINT),
             population int,
             elevation int,
             iso3 CHAR(3));
            CREATE UNIQUE INDEX cities_id_uindex ON public.cities (id);
            CREATE INDEX global_points_gix ON cities USING GIST ( pos );""")

    for c in range(0, len(data)):
        city, country, lat, lng, elevation, population, iso = data.iloc[c][['city', 'country', 'lat', 'lng', 'elevation', 'population', 'iso']]
    
        if c % 100 == 0:
            app.logger.info("Loading data. Loaded %s%", c / len(data) * 100)

        if math.isnan(population):
            population = 0

        with conn.cursor() as cur:
            cur.execute("rollback; INSERT INTO public.cities (name, country, pos, population, elevation, iso3) VALUES (%s, %s, 'SRID=4326;POINT(%s %s)', %s, %s, %s)", (city, country, float(lng), float(lat), int(population), int(elevation), iso))

check_data()

# print(sea_level.head(4))
# levels = sea_level[['year', 'level']]
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
    cur.execute("SELECT id, name, country, elevation, population, ST_X(C.pos::geometry) as lng, ST_Y(C.pos::geometry) as lat, (CASE WHEN elevation > %s THEN 0 ELSE 1 END) as destroyed FROM cities C WHERE ST_Contains(ST_GEOMFROMTEXT('SRID=4326;POLYGON((%s %s, %s %s, %s %s, %s %s, %s %s))'), C.pos::geometry) order by population LIMIT 2000;", (level, swlng, swlat, swlng, nelat, nelng, nelat, nelng, swlat, swlng, swlat))
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
    

# @app.route('/years')
# def send_years():
#     lst = []
#     for i in range(0, len(sea_level)):
#         year, level = levels.iloc[i]
#         lst.append({'year': int(year), 'level': level})

#     return jsonify({'levels': lst})


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

app.run(host=config['serv_host'])