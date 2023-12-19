import sqlite3
from loguru import logger

def main(address):
    logger.debug("Creating db")
    con = sqlite3.connect(f"local_db/outgoing/{address}.db")
    con.execute("""
        CREATE TABLE if not exists transactions(
            amount INTEGER,
            to_address INTEGER,
            block INTEGER,
            transaction_hash INTEGER,
            UID TEXT UNIQUE
        );
    """)
    con = sqlite3.connect(f"local_db/incoming/{address}.db")
    con.execute("""
        CREATE TABLE if not exists transactions(
            amount INTEGER,
            from_address INTEGER,
            block INTEGER,
            transaction_hash INTEGER,
            UID TEXT UNIQUE
        );
    """)