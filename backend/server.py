from flask import Flask, render_template
import database as db
app = Flask(__name__)

@app.route('/insert')
def insert_route():
    data = db.fetch_data()
    return render_template("index.html", data = data)

@app.route('/update')
def update_route():
    data = db.fetch_data()
    return render_template("index.html", data = data)

@app.route('/')
def main():
    data = db.fetch_data()
    return render_template("index.html", data = data)