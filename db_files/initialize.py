from loguru import logger
import os
import sqlite3

def main():
    logger.debug("Initializing DB")
    if not os.path.isdir("local_db"):
        os.mkdir("local_db")

    con = sqlite3.connect("local_db/transactions.db")
    with con:
        con.execute("""
        CREATE TABLE if not exists transactions(
            amount INTEGER,
            from_address TEXT,
            to_address TEXT,
            block INTEGER,
            transaction_hash TEXT,
            UID TEXT UNIQUE
        );
        """)
