from flask import Flask, request, redirect, url_for, send_from_directory, jsonify
import pandas as pd


app = Flask(__name__)
data = pd.read_csv('data.csv')
fields = data[['city','lat', 'lng', 'elevation']]

@app.route('/')
def send_img():
    lst = []
    for i in range(0, len(data)):
        city, lat, lng, elevation = fields.iloc[i]
        lst.append((city, lat, lng, int(elevation)))

    return jsonify(lst)
app.run()