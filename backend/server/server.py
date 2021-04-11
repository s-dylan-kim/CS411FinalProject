from server import db
# import database as db

# @app.route('/insert')
# def insert_route():
#     data = db.fetch_data()
#     return render_template("index.html", data = data)

# @app.route('/update')
# def update_route():
#     data = db.fetch_data()
#     return render_template("index.html", data = data)

# @app.route('/')
# def main():
#     data = db.fetch_data()
#     return render_template("index.html", data = data)


# def fun1():
#     print("hi")

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
