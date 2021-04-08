from flask import Flask, request
app = Flask(__name__)

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