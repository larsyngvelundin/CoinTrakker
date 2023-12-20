from loguru import logger
import sqlite3

import db

def main(db_file):
    logger.debug("test")
    if(isinstance(db_file, int)):
        db_file = db.get_address_from_id(db_file)
    if(db_file.find("addresses") > -1 or db_file.find("hashes") > -1):
        logger.debug("Found addresses, or hashes")
        con = sqlite3.connect(f"local_db/{db_file}.db")
        sql = f"SELECT * FROM {db_file};"
        with con:
            data = con.execute(sql)
            for row in data:
                logger.debug(row)
    else:
        con = sqlite3.connect(f"local_db/incoming/{db_file}.db")
        sql = f"SELECT * FROM transactions;"
        logger.debug(f"Incoming for {db_file}")
        with con:
            data = con.execute(sql)
            for row in data:
                logger.debug(row)
        con = sqlite3.connect(f"local_db/outgoing/{db_file}.db")
        sql = f"SELECT * FROM transactions;"
        logger.debug(f"Outgoing for {db_file}")
        with con:
            data = con.execute(sql)
            for row in data:
                logger.debug(row)