from loguru import logger
import sqlite3

import db

def main(address, block=100):
    if(not db.db_exists(address)):
        logger.info(f"DB for {address} does not exist")
        db.create_db(address)
        logger.info(f"Created DB files")
    outgoing_balance = db.get_transactions_from(address, 0, block)
    incoming_balance = db.get_transactions_to(address, 0, block)
    total_balance = outgoing_balance + incoming_balance
    return total_balance