from flask import Flask, render_template, Response, request, jsonify
import json
import db
from loguru import logger

app = Flask(__name__)

@app.route('/get_transactions_from_address', methods=['POST'])
def get_transactions_from_address():
    #Receives JSON with "address" (Upgrade for block information later)
    request_data = json.loads(request.data)
    logger.info(f"request_data : {request_data}")
    transactions = db.get_transactions_from(request_data['address'])
    logger.debug(transactions)
    return jsonify(transactions)

@app.route('/get_last_block')
def get_last_block():
    logger.info(f"getting last block")
    last_block = db.get_latest_parsed_block()
    logger.info(f"last_block : {last_block}")
    return jsonify(last_block)

@app.route('/')
def index():
    return render_template('./index.html')