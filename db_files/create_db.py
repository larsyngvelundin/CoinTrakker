import sqlite3
from loguru import logger

def main(address):
    logger.info("Creating db")
    con = sqlite3.connect(f"local_db/outgoing/{address}.db")
    con.execute("""
        CREATE TABLE if not exists transactions(
            amount INTEGER,
            to_address TEXT,
            block INTEGER,
            transaction_hash TEXT UNIQUE
        );
    """)
    con = sqlite3.connect(f"local_db/incoming/{address}.db")
    con.execute("""
        CREATE TABLE if not exists transactions(
            amount INTEGER,
            from_address TEXT,
            block INTEGER,
            transaction_hash TEXT UNIQUE
        );
    """)