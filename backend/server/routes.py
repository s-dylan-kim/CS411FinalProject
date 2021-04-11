from flask import request, jsonify
from server import app
from server import db
from server import database as dbase




@app.route('/insertLocations', methods=['GET'])
def insert_Locations():
    _id = request.args.get('_id')
    name = request.args.get('name')
    longitude = request.args.get('longitude')
    latitude = request.args.get('latitude')
    category_id = request.args.get('category_id')
    dbase.insert_Locations(int(_id), name, longitude, latitude, category_id)
    return "inserted " + name

@app.route('/insertCategories', methods=['GET'])
def insert_Categories():
    _id = request.args.get('_id')
    name = request.args.get('name')
    dbase.insert_Categories(int(_id), name)
    return "inserted " + name


#@app.route('/update')
#def update_route():
#    data = db.fetch_data()
#    return render_template("index.html", data = data)

@app.route('/')
def main():
    return "hello"
    # data = db.fetch_data()
    # return render_template("index.html", data = data)


def fun1():
    print("hi")

@app.route('/updateDatabase', methods=['GET'])
def hello_world():
    arg2 = request.args.get('cow')
    fun1()
    return str(arg2)

@app.route('/getTableData', methods=['GET'])
def getTableData():
    table = request.args.get('table')
    return jsonify(dbase.get_table_data(table))

@app.route('/delete', methods=['GET'])
def delete():
    table = request.args.get('table')
    id = request.args.get('id')
    dbase.delete(table, int(id))
