from loguru import logger
import sqlite3

def main(transaction_hash):
    logger.debug("Defunct for now")

    # con = sqlite3.connect(f"local_db/transaction_hashes.db")
    # sql = f"SELECT id FROM transaction_hashes WHERE transaction_hash = '{transaction_hash}';"
    # with con:
    #     data = con.execute(sql)
    # id = data.fetchone()[0]
    # return id