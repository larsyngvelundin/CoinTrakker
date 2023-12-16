import sqlite3
from loguru import logger

import db

def main(amount, to_address, from_address, block, transaction_hash):
    if(not db.db_exists(to_address)):
        logger.info(f"DB for {to_address} does not exist")
        db.create_db(to_address)
        logger.info(f"Created DB files")

    #Save/get the address IDs
    from_address_id = db.save_address(from_address) 
    to_address_id = db.save_address(to_address) 

    #Save/get the transaction ID
    transaction_hash_id = db.save_hash(transaction_hash)

    #Save outgoing for sender
    con = sqlite3.connect(f"local_db/outgoing/{from_address}.db")
    sql =  f'INSERT INTO transactions (amount, to_address, block, transaction_hash) values(?,?,?,?)'
    data = [(amount, to_address_id, block, transaction_hash_id)]
    with con:
        con.executemany(sql, data)
    logger.info(f"Added {transaction_hash} to outgoing/{from_address}.db")

    #Save incoming for recipient
    con = sqlite3.connect(f"local_db/incoming/{to_address}.db")
    sql =  f'INSERT INTO transactions (amount, from_address, block, transaction_hash) values(?,?,?,?)'
    data = [(amount, from_address_id, block, transaction_hash_id)]
    with con:
        con.executemany(sql, data)
    logger.info(f"Added {transaction_hash} to incoming/{to_address}.db")

