from loguru import logger
import sqlite3

import db
import rpc

def main():
    logger.debug(".")
    db_file = db.get_db_name("Mining reward")
    con = sqlite3.connect(f"local_db/outgoing.db")
    sql = 'SELECT MAX(block) from "Mining reward"'
    with con:
        data = con.execute(sql)
    # print(data[0])
    block_height = data.fetchone()[0]
    #get block time
    try:
        block_time = rpc.get_block_time(block_height)
    except ConnectionRefusedError:
        logger.error("Failed to get blocktime, setting 0")
        block_time = 0

    block_info = {'time': block_time, 'height': block_height}

    return block_info