from loguru import logger
import sqlite3

import convert
import db

def main(address, from_block=0, to_block=100):
    if(isinstance(address, int)):
        address = db.get_address_from_id(address)
    logger.debug(f"checking from {address}")
    sql = f"SELECT * FROM '{address}' WHERE block BETWEEN {from_block} and {to_block}"
    db_name = db.get_db_name(address)
    con = sqlite3.connect(f"local_db/outgoing/{db_name}.db")
    with con:
        data = con.execute(sql)
    outgoing = data.fetchall()
    transaction_list = []
    for transaction in outgoing:
        transaction_dict = {}

        # Internal IDs for troubleshooting
        # transaction_dict['amount'] = transaction[0]
        # transaction_dict['from'] = db.get_id_from_address(address)
        # transaction_dict['to'] = transaction[1]
        # transaction_dict['block'] = transaction[2]
        # transaction_dict['hash'] = transaction[3]

        transaction_dict['amount'] = convert.to_btc(transaction[0])
        transaction_dict['from'] = address
        transaction_dict['to'] = db.get_address_from_id(transaction[1])
        transaction_dict['block'] = transaction[2]
        transaction_dict['hash'] = db.get_hash_from_id(transaction[3])
        transaction_list.append(transaction_dict)
        print(transaction)
    return transaction_list