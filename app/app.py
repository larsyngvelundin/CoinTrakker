from flask import Flask, render_template, Response, request, jsonify
import json
import db
from loguru import logger

app = Flask(__name__)

cached_transactions = {}

@app.route('/get_transactions_from_address', methods=['POST'])
def get_transactions_from_address():
    #Receives JSON with "address" (Upgrade for block information later)
    request_data = json.loads(request.data)
    logger.info(f"request_data : {request_data}")
    from_address = request_data['address']
    if (from_address in cached_transactions):
        print("already cached")
        remainder_id = request_data['remainder_id']
        # print(cached_transactions[from_address])
        transactions = cached_transactions[from_address][:5]
        logger.debug(f"transactions returned: {transactions}")
        total_remainder = 0
        address_count = 0
        for i in range(5, len(cached_transactions[from_address])):
            total_remainder += cached_transactions[from_address][i]['amount']
            address_count += 1
        cached_transactions[from_address] = cached_transactions[from_address][5:]
        transactions.append({
            'amount': total_remainder,
            'from' : from_address,
            'to' : f"{address_count} other addresses",
            'block' : "Various",
            'hash': "Various"
            })
        return jsonify(transactions)
    else:
        transactions = db.get_transactions_from(from_address)
        sorted_transactions = sorted(transactions, key=lambda d: d['amount'], reverse=True)
        cached_transactions[from_address] = sorted_transactions
        transactions = cached_transactions[from_address][:5]
        logger.debug(f"transactions returned: {transactions}")
        logger.debug(f"cached_transactions[from_address]: {cached_transactions[from_address]}")
        total_remainder = 0
        address_count = 0
        for i in range(5, len(cached_transactions[from_address])):
            total_remainder += cached_transactions[from_address][i]['amount']
            address_count += 1
        cached_transactions[from_address] = cached_transactions[from_address][5:]
        transactions.append({
            'amount': total_remainder,
            'from' : from_address,
            'to' : f"{address_count} other addresses",
            'block' : "Various",
            'hash': "Various"
            })
        logger.debug(f"cached_transactions[from_address]: {cached_transactions[from_address]}")
        return jsonify(transactions)



@app.route('/get_transactions_to_address', methods=['POST'])
def get_transactions_to_address():
    #Receives JSON with "address" (Upgrade for block information later)
    request_data = json.loads(request.data)
    logger.info(f"request_data : {request_data}")
    transactions = db.get_transactions_to(request_data['address'])
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