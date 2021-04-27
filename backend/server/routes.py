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
    dbase.insert_Locations(int(_id), name, longitude, latitude)
    return "inserted " + name

@app.route('/insertCategories', methods=['POST'])
def insert_Categories():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    name = data['name']
    dbase.insert_Categories(int(_id), name)
    return "inserted " + name

@app.route('/insertUsers', methods=['POST'])
def insert_User():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    name = data['name']
    hasCovid = data['hasCovid']
    username = data['username']
    password = data['password']
    dbase.insert_User(int(_id), name, hasCovid, username, password)
    return "inserted " + name

@app.route('/insertUserVisited', methods=['POST'])
def insert_UserVisited():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    userID = data['userID']
    locationID = data['locationID']
    time = data['time']
    hasCOVID = data['hasCOVID']
    dbase.insert_UserVisited(int(_id), userID, locationID, time, hasCOVID)
    return "inserted user visited"

@app.route('/insertReviews', methods=['POST'])
def insert_Reviews():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    rating = data['rating']
    userID = data['userID']
    locationID = data['locationID']
    review = data['review']
    dbase.insert_Reviews(int(_id), rating, userID, locationID, review)
    return "inserted review"

@app.route('/insertAnswers', methods=['POST'])
def insert_Answers():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    answer = data['answer']
    questionID = data['questionID']
    userID = data['userID']
    dbase.insert_Answers(int(_id), answer, questionID, userID)
    return "inserted answer"

@app.route('/insertLocationOfType', methods=['POST'])
def insert_LocationOfType():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    locationID = data['locationID']
    categoryID = data['categoryID']
    dbase.insert_LocationOfType(int(locationID), categoryID)
    return "inserted location type"

@app.route('/insertQuestions', methods=['POST'])
def insert_Questions():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    question = data['question']
    userId = data['userId']
    locationId = data['locationId']
    dbase.insert_Questions(int(_id), question, userId, locationId)
    return "inserted question"


#@app.route('/update')
#def update_route():
#    data = db.fetch_data()
#    return render_template("index.html", data = data)

@app.route('/updateQuestions', methods=['POST'])
def updateQuestions():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    question = data['question']
    userId = data['userId']
    locationId = data['locationId']
    dbase.update_Questions(int(_id), question, userId, locationId)
    return "update Questions"

@app.route('/updateReviews', methods=['POST'])
def updateReviews():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    rating = data['rating']
    userID = data['userID']
    locationID = data['locationID']
    review = data['review']
    dbase.update_Reviews(int(_id), rating, userID, locationID, review)
    return "update Reviews"

@app.route('/updateUsers', methods=['POST'])
def updateUsers():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    name = data['name']
    hasCovid = data['hasCovid']
    username = data['username']
    password = data['password']
    dbase.update_Users(id, name, hasCovid, username, password)
    return "update Users"

@app.route('/updateUserVisited', methods=['POST'])
def updateUserVisited():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    
    _id = data['id']
    userID = data['userID']
    locationID = data['locationID']
    time = data['time']
    hasCOVID = data['hasCOVID']
    dbase.update_UserVisited(int(_id), userID, locationID, time, hasCOVID)
    return "updated UserVisited"

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
    table = request.args.get('table')
    column = request.args.get('column')
    keyword = request.args.get('keyword')
    query_results = dbase.search(table, column, keyword)
    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/updateLocations', methods=['POST'])
def update_Locations():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    name = data['name']
    longitude = data['longitude']
    latitude = data['latitude']
    dbase.update_Locations(int(_id), name, longitude, latitude)
    return "updated " + name

@app.route('/updateCategories', methods=['POST'])
def update_Categories():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    name = data['name']
    dbase.update_Categories(int(_id), name)
    return "updated " + name

@app.route('/updateAnswers', methods=['POST'])
def update_Answers():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    _id = data['id']
    answer = data['answer']
    questionID = data['questionID']
    userID = data['userID']
    dbase.update_Answers(int(_id), answer, questionID, userID)
    return "updated answer"

@app.route('/updateLocationOfType', methods=['POST'])
def update_LocationOfType():
    dataJSON = request.get_json()
    data = dataJSON['data']['data']
    locationID = data['locationID']
    categoryID = data['categoryID']
    dbase.update_LocationOfType(int(locationID), categoryID)
    return "updated location type"

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

@app.route('/getLocationsMostRisk', methods=['GET'])
def getLocationsMostRisk():
    conn = db.connect()
    query = "SELECT * FROM LocationMostRisk;"
    query_results = conn.execute(query)
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/getAnswers', methods=['GET'])
def get_Answers():
    questionID = request.args.get('questionID')
    query_results = dbase.get_Answers(questionID)
    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/getLocationsLeastRisk', methods=['GET'])
def getLocationsLeastRisk():
    conn = db.connect()
    query = "SELECT * FROM LocationLeastRisk;"
    query_results = conn.execute(query)
    result_dict = {'results': results}
    return jsonify(result_dict)

@app.route('/getLocationData', methods=['GET'])
def get_Location_Data():
    locationID = request.args.get('id')
    location_results = dbase.get_Locations(locationID)
    # visited_results = dbase.get_UserVisited(locationID)
    question_results = dbase.get_Questions(locationID)
    review_results = dbase.get_Reviews(locationID)
    lresults = [dict(row) for row in location_results]
    # vresults = [dict(row) for row in visited_results]
    qresults = [dict(row) for row in question_results]
    rresults = [dict(row) for row in review_results]
    # 'UserVisitedResults': vresults,
    result_dict = {'LocationResults': lresults, 'QuestionResults': qresults, 'ReviewResults': rresults}
    return jsonify(result_dict)

@app.route('/UserVisitedRange', methods=['GET'])
def UserVisited_Range():
    days = request.args.get('days')
    query_results = dbase.UserVisited_Range(days)
    results = [dict(row) for row in query_results]
    result_dict = {'results': results}
    return jsonify(result_dict)


@app.route('/LocationID', methods=['GET'])
def getLocationId():
    name = request.args.get('name')
    query_results = dbase.get_LocationId(name)

    results = [dict(row) for row in query_results]
    print(results)
    result_dict = {'results': results}
    return jsonify(result_dict)