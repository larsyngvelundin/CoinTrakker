from loguru import logger
import sqlite3

import db

def main(address, from_block=0, to_block=100):
    balance = 0
    if(isinstance(address, int)):
        address = db.get_address_from_id(address)
    logger.debug(f"checking from {address}")
    sql = f"SELECT amount FROM transactions WHERE block BETWEEN {from_block} and {to_block}"
    con = sqlite3.connect(f"local_db/outgoing/{address}.db")
    with con:
        data = con.execute(sql)
    outgoing = data.fetchall()
    for transaction in outgoing:
        logger.debug(transaction)
        balance -= transaction[0]
    return balance