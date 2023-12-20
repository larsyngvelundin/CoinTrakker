from loguru import logger
import sqlite3

import db

def main(address, block=100):
    if(isinstance(address, int)):
        address = db.get_address_from_id(address)
    if(not db.db_exists(address)):
        logger.debug(f"DB for {address} does not exist")
        db.create_db(address)
        logger.debug(f"Created DB files")
    logger.debug(f"Trying to check transactions from 0 to {block}")
    outgoing_balance = db.get_transactions_from(address, from_block = 0, to_block = block)
    incoming_balance = db.get_transactions_to(address, from_block = 0, to_block = block)
    total_balance = outgoing_balance + incoming_balance
    return total_balance