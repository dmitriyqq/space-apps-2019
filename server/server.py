from flask import Flask, request, redirect, url_for, send_from_directory, jsonify
import pandas as pd

app = Flask(__name__)

cities_data = pd.read_csv('cities_data.csv')
sea_level = pd.read_csv('sea_level.csv', index_col=False)

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

@app.route('/years')
def send_years():
    lst = []
    for i in range(0, len(sea_level)):
        year, level = levels.iloc[i]
        lst.append({'year': int(year), 'level': level})

    return jsonify({'levels': lst})


app.run()