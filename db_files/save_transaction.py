import sqlite3
from loguru import logger

import db

def main(amount, to_address, from_address, block, transaction_hash):
    if(not db.db_exists(to_address)):
        logger.info(f"DB for {to_address} does not exist")
        db.create_db(to_address)
        logger.info(f"Created DB files")
    if(not db.db_exists(from_address)):
        logger.info(f"DB for {from_address} does not exist")
        db.create_db(from_address)
        logger.info(f"Created DB files")

    #Save/get the address IDs
    from_address_id = db.save_address(from_address) 
    to_address_id = db.save_address(to_address) 

    #Save/get the transaction ID
    transaction_hash_id = db.save_hash(transaction_hash)

    UID = f"{from_address_id}-{to_address_id}-{transaction_hash_id}"

    #Save outgoing for sender
    try:
        con = sqlite3.connect(f"local_db/outgoing/{from_address}.db")
        sql =  f'INSERT INTO transactions (amount, to_address, block, transaction_hash, UID) values(?,?,?,?,?)'
        data = [(int(amount), str(to_address_id), int(block), str(transaction_hash_id), UID)]
        with con:
            con.executemany(sql, data)
        logger.info(f"Added {transaction_hash} to outgoing/{from_address}.db")
    except Exception as error_msg:
        logger.error(error_msg)
        logger.info("already saved this transaction")
    #Save incoming for recipient
    try:
        con = sqlite3.connect(f"local_db/incoming/{to_address}.db")
        sql =  f'INSERT INTO transactions (amount, from_address, block, transaction_hash, UID) values(?, ?,?,?,?)'
        data = [(int(amount), str(to_address_id), int(block), str(transaction_hash_id), UID)]
        with con:
            con.executemany(sql, data)
        logger.info(f"Added {transaction_hash} to incoming/{to_address}.db")
    except Exception as error_msg:
        logger.error(error_msg)
        logger.info("already saved this transaction")

