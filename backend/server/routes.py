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
    dbase.delete(table, id)
    return "200"

@app.route('/search', methods=['GET'])
def search():
    data = request.get_json()
    table = data['table']
    column = data['column']
    keyword = data['keyword']
    query_results = dbase.search(table, column, keyword)
    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/locationCategory', methods=['GET'])
def locationCategory():
    conn = db.connect()
    query = "SELECT Categories.name AS category_name, Locations.name AS location_name FROM LocationOfType JOIN Categories ON LocationOfType.categoryID = Categories.id JOIN Locations ON LocationOfType.locationID = Locations.id GROUP BY Categories.name, Locations.name ORDER BY Categories.name;"
    query_results = conn.execute(query)
    conn.close()

    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/locationsPositive', methods=['GET'])
def locationsPositive():
    conn = db.connect()
    query = "SELECT DISTINCT L.name, count(distinct U.id) as NumberVisited FROM Users U JOIN UserVisited UV ON U.id = UV.userID JOIN Locations L ON UV.locationID = L.id WHERE U.hasCovid = 1 GROUP BY L.name;"
    query_results = conn.execute(query)
    conn.close()

    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/restaurantRatings', methods=['GET'])
def restaurantRatings():
    conn = db.connect()
    query = "SELECT DISTINCT l.name, AVG(r.rating) as avg_rating FROM Reviews r JOIN Locations l ON r.locationID = l.id WHERE l.name = ANY (SELECT l.name FROM Locations l JOIN LocationOfType t on l.id = t.locationID JOIN Categories c ON t.categoryID = c.id WHERE c.name = 'Restaurant') GROUP BY l.name ORDER BY avg_rating DESC;"
    query_results = conn.execute(query)
    conn.close()

    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/restaurantHoursVisited', methods=['GET'])
def restaurantHoursVisited():
    conn = db.connect()
    query = "SELECT hour(time) as hourVisited, sum(hasCovid=1) as CovidCount, sum(hasCovid=0) as nonCovidCount FROM UserVisited WHERE locationID in (SELECT locationID FROM LocationOfType WHERE categoryID = 1) GROUP BY hour(time) ORDER BY hourVisited;"
    query_results = conn.execute(query)
    conn.close()

    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)
