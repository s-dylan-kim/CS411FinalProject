from flask import request, jsonify
from server import app
from server import db

from server import database as dbase



@app.route('/insert')
def insert_route():
    data = db.fetch_data()
    return render_template("index.html", data = data)

@app.route('/update')
def update_route():
    data = db.fetch_data()
    return render_template("index.html", data = data)


@app.route('/updateDatabase', methods=['GET'])
def hello_world():
    arg2 = request.args.get('cow')
    fun1()
    return str(arg2)

@app.route('/getTableData', methods=['GET'])
def getTableData():
    table = request.args.get('table')
    result = dbase.get_table_data(table)
    results = [dict(row) for row in result] 
    return jsonify({'results': results})

@app.route('/delete', methods=['GET'])
def delete():
    table = request.args.get('table')
    id = request.args.get('id')
    dbase.delete(table, int(id))
