from loguru import logger
import sqlite3

import db
import rpc

def main():
    logger.debug("Getting last parsed block")
    # db_file = db.get_db_name("Mining reward")
    con = sqlite3.connect(f"local_db/transactions.db")
    cursor = con.cursor()
    sql = """
            SELECT MAX(block)
            FROM transactions
        """
    with con:
        data = cursor.execute(sql)
    # # print(data[0])
    block_height = data.fetchone()[0]
    logger.info(block_height)
    # #get block time
    try:
        block_time = rpc.get_block_time(block_height)
    except ConnectionRefusedError:
        logger.error("Failed to get blocktime, setting 0")
        block_time = 0

    block_info = {'time': block_time, 'height': block_height}

    return block_info