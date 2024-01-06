from loguru import logger
import sqlite3

import convert

def main(address, from_block=0, to_block=1000000):
    logger.debug(f"Getting all transactions from {address}")
    logger.debug(f"checking from {address}")
    sql = f"SELECT * FROM transactions WHERE to_address = '{address}' AND block BETWEEN {from_block} and {to_block}"
    logger.info(sql)
    con = sqlite3.connect(f"local_db/transactions.db")
    with con:
        data = con.execute(sql)
    outgoing = data.fetchall()
    transaction_list = []
    for transaction in outgoing:
        transaction_dict = {}
        transaction_dict['amount'] = convert.to_btc(transaction[0])
        transaction_dict['from'] = address
        transaction_dict['to'] = transaction[2]
        transaction_dict['block'] = transaction[3]
        transaction_dict['hash'] = transaction[4]
        transaction_list.append(transaction_dict)
    return transaction_list