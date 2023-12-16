from loguru import logger
import sqlite3

def main(db_file):
    logger.info("test")
    if(db_file.find("addresses") > -1 or db_file.find("hashes") > -1):
        logger.info("Found addresses, or hashes")
        con = sqlite3.connect(f"local_db/{db_file}.db")
        sql = f"SELECT * FROM {db_file};"
        with con:
            data = con.execute(sql)
            for row in data:
                logger.info(row)
    else:
        con = sqlite3.connect(f"local_db/incoming/{db_file}.db")
        sql = f"SELECT * FROM transactions;"
        logger.info(f"Incoming for {db_file}")
        with con:
            data = con.execute(sql)
            for row in data:
                logger.info(row)
        con = sqlite3.connect(f"local_db/outgoing/{db_file}.db")
        sql = f"SELECT * FROM transactions;"
        logger.info(f"Outgoing for {db_file}")
        with con:
            data = con.execute(sql)
            for row in data:
                logger.info(row)