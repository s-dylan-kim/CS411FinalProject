import random
from server import db
from datetime import datetime, timedelta, date
import time

def update(data, entry_num, us, loc, rev, rat):
    data[entry_num]["user"] = us
    data[entry_num]["location"] = loc
    data[entry_num]["review"] = rev
    data[entry_num]["rating"] = rat

def get_table_data(table):
    """ gets all of the data in 'table' """
    conn = db.connect()
    query = 'SELECT * FROM ' + str(table) + ' LIMIT 1000;'
    query_results = conn.execute(query)
    query_results = [entry for entry in query_results]
    conn.close()
    return query_results

# def delete(table, id):
#     """ removes from 'table' the entry that matches with 'id' """

def insert_Locations(_id:int, name:str, longitude:int, latitude:int):
    conn = db.connect()
    query1 = 'INSERT INTO Locations (id, name, longitude, latitude) VALUES ("{}", "{}", "{}", "{}")'.format(_id, name, longitude, latitude)
    conn.execute(query1)
    conn.close()

def insert_Categories(_id:int, name:str):
    conn = db.connect()
    query1 = 'INSERT INTO Categories (id, name) VALUES ("{}", "{}")'.format(_id, name)
    conn.execute(query1)
    conn.close()

def insert_User(_id:int, name:str, hasCovid:int, username:str, password:str):
    conn = db.connect()
    query1 = 'INSERT INTO Users (id, name, hasCovid, username, password) VALUES ("{}", "{}", "{}", "{}", "{}")'.format(_id, name, hasCovid, username, password)
    conn.execute(query1)
    conn.close()

def insert_UserVisited(_id:int, userID:int, locationID:int, time:str, hasCOVID:int):
    conn = db.connect()
    # weird stored procedure insert fix but it works I guess
    query1 = ''
    if hasCOVID == 0:
        query1 = 'INSERT INTO UserVisited (id, userID, locationID, time, hasCOVID) VALUES ("{}", "{}", "{}", "{}", "{}")'.format(_id, userID, locationID, time, hasCOVID)
    else:
        query1 = 'CALL updateCovidStatus("{}", "{}", "{}", "{}", "{}")'.format(_id, userID, locationID, time, hasCOVID)
    conn.execute(query1)
    conn.close()

def insert_Reviews(_id:int, rating:int, userID:int, locationID:int, review:str):
    conn = db.connect()
    query1 = 'INSERT INTO Reviews (id, rating, userID, locationID, review) VALUES ("{}", "{}", "{}", "{}", "{}")'.format(_id, rating, userID, locationID, review)
    conn.execute(query1)
    conn.close()

def insert_Answers(_id:int, answer:str, questionID:int, userID:int):
    conn = db.connect()
    query1 = 'INSERT INTO Answers (id, answer, questionID, userID) VALUES ("{}", "{}", "{}", "{}")'.format(_id, answer, questionID, userID)
    conn.execute(query1)
    conn.close()

def insert_LocationOfType(locationID:int, categoryID:int):
    conn = db.connect()
    query1 = 'INSERT INTO LocationOfType (locationID, categoryID) VALUES ("{}", "{}")'.format(locationID, categoryID)
    conn.execute(query1)
    conn.close()

def insert_Questions(_id:int, question:str, userId:int, locationId:int):
    conn = db.connect()
    query1 = 'INSERT INTO Questions (_id, question, userId, locationId) VALUES ("{}", "{}", "{}", "{}")'.format(_id, question, userId, locationId)
    conn.execute(query1)
    conn.close()
 
def delete(table, id: int) -> None:
    """ removes from 'table' the entry that matches with 'id' """
    conn = db.connect()
    query = 'DELETE FROM ' + str(table) + ' WHERE id={};'.format(int(id))
    conn.execute(query)
    conn.close()


def tableColumns(table):
    """Reads all tasks listed in the todo table

    Returns:
        A list of dictionaries
    """

    conn = db.connect()
    query_results = conn.execute("SHOW COLUMNS FROM Locations;")
    conn.close()
    #todo_list = []
    # print(query_results)
    # for result in query_results:
    #     item = {
    #         "id": result[0],
    #         "task": result[1],
    #         "status": result[2]
    #     }
    #     todo_list.append(item)

    return query_results

def search(table, column, keyword):
    """ Searches in 'table' where 'column' is like 'keyword' """

    conn = db.connect()
    query = 'SELECT * FROM ' + str(table) + ' WHERE ' + str(column) + " LIKE '%%" + str(keyword) + "%%' LIMIT 1000;"
    query_results = conn.execute(query)
    conn.close()

    return query_results

def update_Locations(_id:int, name:str, longitude:int, latitude:int):
    conn = db.connect()
    query1 = 'UPDATE Locations SET name = "{}", longitude = "{}", latitude = "{}" WHERE id = "{}"'.format(name, longitude, latitude, _id)
    conn.execute(query1)
    conn.close()

def update_Categories(_id:int, name:str):
    conn = db.connect()
    query1 = 'UPDATE Categories SET name = "{}" WHERE id = "{}"'.format(name, _id)
    conn.execute(query1)
    conn.close()

def update_Answers(_id:int, answer:str, questionID:int, userID:int):
    conn = db.connect()
    query1 = 'UPDATE Answers SET answer = "{}", questionID = "{}", userID = "{}" WHERE id = "{}"'.format(answer, questionID, userID, _id)
    conn.execute(query1)
    conn.close()

def update_LocationOfType(locationID:int, categoryID:int):
    conn = db.connect()
    query1 = 'UPDATE LocationOfType SET locationID = "{}", categoryID = "{}" WHERE locationID = "{}" and categoryID = "{}"'.format(locationID, categoryID, locationID, categoryID)
    conn.execute(query1)
    conn.close()

def update_Questions(id, question, userId, locationId):
    conn = db.connect()
    query = 'UPDATE Questions SET question = "{}", userId = "{}", locationId = "{}" WHERE id = "{}"'.format(str(question), int(userId), int(locationId), int(id))
    conn.execute(query)
    conn.close()

def update_Reviews(id, rating, userID, locationID, review):
    conn = db.connect()
    query = 'UPDATE Reviews SET rating = "{}", userID = "{}", locationID = "{}", review = "{}" WHERE id = "{}"'.format(int(rating), int(userID), int(locationID), str(review),int(id))
    conn.execute(query)
    conn.close()

def update_Users(id, name, hasCovid, username, password):
    conn = db.connect()
    query = 'UPDATE Users SET name = "{}", hasCovid = "{}", username = "{}", password = "{}" WHERE id = "{}"'.format(str(name), int(hasCovid), str(username), str(password), int(id))
    conn.execute(query)
    conn.close()

def update_UserVisited(id, userID, locationID, time, hasCOVID):
    conn = db.connect()
    query = 'UPDATE UserVisited SET userID = "{}", locationID = "{}", time = "{}", hasCOVID = "{}" WHERE id = "{}"'.format(int(userID), int(locationID), str(time), int(hasCOVID), int(id))
    conn.execute(query)
    conn.close()

def userNotInDatabase(username, password):
    conn = db.connect()
    query = "SELECT COUNT(*) AS C FROM Users WHERE username = '{}' AND password = '{}';".format(username, password)
    query_results = conn.execute(query)
    conn.close()
    results = [dict(row) for row in query_results]
    result_dict = {0: results}
    # print(type(results[0]['C']))
    return not bool(results[0]['C'])
def get_Answers(questionID:int):
    conn = db.connect()
    query = 'SELECT * FROM Answers WHERE questionID = ' + questionID
    query_results = conn.execute(query)
    conn.close()
    return query_results

def get_Locations(locationID:int):
    conn = db.connect()
    query = 'SELECT name, longitude, latitude FROM Locations WHERE id = ' + locationID
    query_results = conn.execute(query)
    conn.close()
    return query_results

# def get_UserVisited(locationID:int):
#     conn = db.connect()
#     query = 'SELECT id, userID, time, hasCOVID FROM UserVisited WHERE locationID = ' + locationID
#     query_results = conn.execute(query)
#     conn.close()
#     return query_results

def get_Questions(locationID:int):
    conn = db.connect()
    query = 'SELECT id, question, userId FROM Questions WHERE locationId = ' + locationID
    query_results = conn.execute(query)
    conn.close()
    return query_results

def get_Reviews(locationID:int):
    conn = db.connect()
    query = 'SELECT id, rating, userID, review FROM Reviews WHERE locationID = ' + locationID
    query_results = conn.execute(query)
    conn.close()
    return query_results

def get_Categories(locationID:int):
    conn = db.connect()
    query = 'SELECT * FROM Categories WHERE id = ANY(SELECT categoryID FROM LocationOfType WHERE locationID = ' + locationID + ')' 
    query_results = conn.execute(query)
    conn.close()
    return query_results

def UserVisited_Range(num:int, locationID:int):
    date = datetime.now() - timedelta(int(num))
    pastdate = date.strftime("%Y-%m-%d %H:%M:%S")
    conn = db.connect()
    query = "SELECT sum(hasCOVID = 1) as covid, sum(hasCOVID = 0) as notCovid FROM UserVisited WHERE time > '" + pastdate + "' AND locationID = " + locationID
    query_results = conn.execute(query)
    conn.close()
    return query_results

def get_LocationId(name:int):
    conn = db.connect()
    query = "SELECT id FROM Locations WHERE name = '" + name + "'"
    query_results = conn.execute(query)
    conn.close()
    return query_results
