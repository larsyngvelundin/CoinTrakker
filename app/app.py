from flask import Flask, render_template, Response, request, jsonify
import math
import json
import random
import db
from loguru import logger

app = Flask(__name__)

my_variable = "<span>0</span>"

@app.route('/set_test')
def set_test():
    global my_variable
    my_variable += f"<span>{random.randint(3,10)}</span>"
    print(f"Set the variable to {my_variable}")
    return "success"

@app.route('/get_test')
def get_test():
    return str(my_variable)

@app.route('/fps')
def fps():
    print ('we are calling')
    the_answer = random.randint(25, 60)
    return (str(the_answer))

@app.route('/get_transactions_from_address', methods=['POST'])
def get_transactions_from_address():
    #Receives JSON with "address" (Upgrade for block information later)
    address = json.loads(request.data)['address']
    logger.debug(address)
    transactions = db.get_transactions_from(address)
    logger.debug(transactions)
    return jsonify(transactions)

@app.route('/get_new', methods=['POST'])
def get_new():
    # print("get new")
    # print(dir(request))
    # print(json.loads(request.data))
    # print(request.data)
    test = json.loads(request.data)
    # data = request.json
    # test = json.dumps(data)
    print(test['data'])
    new_data = {'content':'["Ford", "BMW", "Fiat"]'}
    return jsonify(new_data)

@app.route('/')
def index():
    return render_template('./index.html')