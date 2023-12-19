from loguru import logger
import sqlite3

def main(address, from_block=0, to_block=100):
    balance = 0
    logger.info(f"checking from {address}")
    sql = f"SELECT amount FROM transactions WHERE block BETWEEN {from_block} and {to_block}"
    con = sqlite3.connect(f"local_db/outgoing/{address}.db")
    with con:
        data = con.execute(sql)
    outgoing = data.fetchall()
    for transaction in outgoing:
        logger.debug(transaction)
        balance -= transaction[0]
    # logger.info(balance)
    return balance