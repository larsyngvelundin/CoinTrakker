from loguru import logger
import sqlite3

def main(id):
    logger.debug("Defunct for now")

    # con = sqlite3.connect(f"local_db/transaction_hashes.db")
    # sql = f"SELECT transaction_hash FROM transaction_hashes WHERE id = '{id}';"
    # with con:
    #     data = con.execute(sql)
    # transaction_hash = data.fetchone()[0]
    # return transaction_hash