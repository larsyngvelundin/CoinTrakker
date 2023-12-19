from loguru import logger
import sqlite3

def main(address):
    logger.info("test")

    con = sqlite3.connect(f"local_db/addresses.db")
    sql = f"SELECT id FROM addresses WHERE address = '{address}';"
    with con:
        data = con.execute(sql)
    id = data.fetchone()[0]
    return id