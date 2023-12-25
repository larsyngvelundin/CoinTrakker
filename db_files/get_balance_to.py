from loguru import logger
import sqlite3

import db

def main(address, from_block=0, to_block=100):
    balance = 0
    if(isinstance(address, int)):
        address = db.get_address_from_id(address)
    logger.debug(f"checking to {address}")
    sql = f"SELECT amount FROM '{address}' WHERE block BETWEEN {from_block} and {to_block}"
    db_name = db.get_db_name(address)
    con = sqlite3.connect(f"local_db/incoming/{db_name}.db")
    with con:
        data = con.execute(sql)
    outgoing = data.fetchall()
    for transaction in outgoing:
        logger.debug(transaction)
        balance += transaction[0]
    # logger.debug(balance)
    return balance