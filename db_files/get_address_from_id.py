from loguru import logger
import sqlite3

def main(id):
    logger.debug("defunct for now")

    # con = sqlite3.connect(f"local_db/addresses.db")
    # sql = f"SELECT address FROM addresses WHERE id = '{id}';"
    # with con:
    #     data = con.execute(sql)
    # address = data.fetchone()[0]
    # return address