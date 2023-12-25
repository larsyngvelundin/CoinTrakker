import sqlite3
from loguru import logger

import db

def main(address):
    logger.debug("Creating db")
    db_name = db.get_db_name(address)
    con = sqlite3.connect(f"local_db/outgoing/{db_name}.db")
    con.execute(f"""
        CREATE TABLE if not exists "{address}"(
            amount INTEGER,
            to_address INTEGER,
            block INTEGER,
            transaction_hash INTEGER,
            UID TEXT UNIQUE
        );
    """)
    con = sqlite3.connect(f"local_db/incoming/{db_name}.db")
    con.execute(f"""
        CREATE TABLE if not exists "{address}"(
            amount INTEGER,
            from_address INTEGER,
            block INTEGER,
            transaction_hash INTEGER,
            UID TEXT UNIQUE
        );
    """)