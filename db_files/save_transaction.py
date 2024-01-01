import sqlite3
from loguru import logger

import db

def main(amount, to_address, from_address, block, transaction_hash):
    db.create_db(to_address)
    # if(not db.db_exists(to_address)):
    #     logger.debug(f"DB for {to_address} does not exist")
    #     db.create_db(to_address)
    #     logger.debug(f"Created DB files")
    # if(not db.db_exists(from_address)):
    #     logger.debug(f"DB for {from_address} does not exist")
    #     db.create_db(from_address)
    #     logger.debug(f"Created DB files")

    #Save/get the address IDs
    from_address_id = db.save_address(from_address) 
    to_address_id = db.save_address(to_address) 

    #Save/get the transaction ID
    transaction_hash_id = db.save_hash(transaction_hash)

    UID = f"{from_address_id}-{to_address_id}-{transaction_hash_id}"

    #Save outgoing for sender
    try:
        db_name = db.get_db_name(from_address)
        con = sqlite3.connect(f"local_db/outgoing.db")
        sql =  f'INSERT INTO "{from_address}" (amount, to_address, block, transaction_hash, UID) values(?,?,?,?,?)'
        data = [(int(amount), int(to_address_id), int(block), int(transaction_hash_id), UID)]
        with con:
            con.executemany(sql, data)
        logger.debug(f"Added {transaction_hash} to outgoing.db")
    except Exception as error_msg:
        logger.debug(error_msg)
        logger.debug("already saved this transaction")
    #Save incoming for recipient
    try:
        db_name = db.get_db_name(to_address)
        con = sqlite3.connect(f"local_db/incoming.db")
        sql =  f'INSERT INTO "{to_address}" (amount, from_address, block, transaction_hash, UID) values(?, ?,?,?,?)'
        data = [(int(amount), int(from_address_id), int(block), int(transaction_hash_id), UID)]
        with con:
            con.executemany(sql, data)
        logger.debug(f"Added {transaction_hash} to incoming.db")
    except Exception as error_msg:
        logger.debug(error_msg)
        logger.debug("already saved this transaction")

