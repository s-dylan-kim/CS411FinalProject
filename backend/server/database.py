from server import db
# import random


def fetch_data() -> dict:
        data = [
            {
                "user": "Anonymous",
                "location": "Panda Express",
                "review": "Tastes good",
                "rating": 9
            },
            {
                "user": "Anonymous",
                "location": "Taco Bell",
                "review": "feelsbadman",
                "rating": 3
            },
            {
                "user": "Anonymous",
                "location": "McDonald's",
                "review": "Cheap",
                "rating": 5
            }
        ]
        return data

def update(data, entry_num, us, loc, rev, rat):
    data[entry_num]["user"] = us
    data[entry_num]["location"] = loc
    data[entry_num]["review"] = rev
    data[entry_num]["rating"] = rat


def insert(data, us, loc, rev, rat):
    item = {"user": us,
            "location": loc,
            "review": rev,
            "rating": rat
            }
    data.append(item)

def get_table_data(table):
    """ gets all of the data in 'table' """
    conn = db.connect()
    query = 'SELECT * FROM ' + str(table) + ';'
    query_results = conn.execute(query)
    query_results = [entry for entry in query_results]
    conn.close()
    return query_results

def delete(table, id):
    """ removes from 'table' the entry that matches with 'id' """
    conn = db.connect()
    query = 'DELETE FROM ' + str(table) + ' WHERE id={};'.format(id)
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
    todo_list = []
    print(query_results)
    # for result in query_results:
    #     item = {
    #         "id": result[0],
    #         "task": result[1],
    #         "status": result[2]
    #     }
    #     todo_list.append(item)

    return query_results
