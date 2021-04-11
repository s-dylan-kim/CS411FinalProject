from flask import Flask, render_template, request
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


def fun1():
    print("hi")

@app.route('/updateDatabase', methods=['GET'])
def hello_world():
    arg2 = request.args.get('cow')
    fun1()
    return str(arg2)


@app.route('/delete', methods=['GET'])
def delete():
    return '<p>hello world</p>'
