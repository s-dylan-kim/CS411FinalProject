from flask import request, jsonify
from server import app
from server import db
from server import database as dbase



@app.route('/insertLocations', methods=['POST'])
def insert_Locations():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    name = data['name']
    longitude = data['longitude']
    latitude = data['latitude']
    # category_id = data['category_id']
    dbase.insert_Locations(int(_id), name, longitude, latitude)
    # , category_id
    return "inserted " + name

@app.route('/insertCategories', methods=['POST'])
def insert_Categories():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    name = data['name']
    dbase.insert_Categories(int(_id), name)
    return "inserted " + name


#@app.route('/update')
#def update_route():
#    data = db.fetch_data()
#    return render_template("index.html", data = data)


@app.route('/getTableData', methods=['GET'])
def getTableData():
    table = request.args.get('table')
    result = dbase.get_table_data(table)
    results = [dict(row) for row in result] 
    return jsonify({'results': results})

# @app.route('/updateDatabase', methods=['GET'])
# def hello_world():
#     arg2 = request.args.get('cow')
#     fun1()
#     return str(arg2)

# @app.route('/delete', methods=['GET'])
# def delete():
#     table = request.args.get('table')
#     id = request.args.get('id')
#     db.delete(table, int(id))

@app.route('/getTableColumns', methods=['GET'])
def getColumnsFromTable():
    arg1 = str(request.args.get('table'))
    conn = db.connect()
    query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'covid_tracker' AND TABLE_NAME = '{}';".format(arg1)
    query_results = conn.execute(query)
    conn.close()

    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/getTableNames', methods=['GET'])
def getTableNames():
    conn = db.connect()
    query = "SELECT Table_name as TableName from information_schema.tables where table_schema = 'covid_tracker';"
    query_results = conn.execute(query)
    conn.close()

    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/delete', methods=['DELETE'])
def delete():
    data = request.get_json()
    table = data['table']
    id = data['data']['id']
    dbase.delete(table, int(id))
    return "200"