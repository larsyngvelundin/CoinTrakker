from loguru import logger
import os
import sqlite3

def main():
    logger.debug("Test")
    #check if local_db folder exists
    if not os.path.isdir("local_db"):
        os.mkdir("local_db")
        # os.mkdir("local_db/incoming")
        # os.mkdir("local_db/outgoing")
    #create wallets.db/addresses.db
    con = sqlite3.connect("local_db/addresses.db")
    with con:
        con.execute("""
        CREATE TABLE if not exists addresses(
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            address TEXT UNIQUE
        );
        """)

    con = sqlite3.connect("local_db/transaction_hashes.db")
    with con:
        con.execute("""
        CREATE TABLE if not exists transaction_hashes(
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            transaction_hash TEXT UNIQUE
        );
        """)
    
    pass

