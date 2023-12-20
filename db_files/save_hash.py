from loguru import logger
import sqlite3

def main(transaction_hash):
    logger.debug("test")
    con = sqlite3.connect("local_db/transaction_hashes.db")
    #Try to save the hash
    try:
        cursor = con.cursor()
        sql = f'INSERT INTO transaction_hashes (transaction_hash) VALUES (?)'
        cursor.execute(sql, (transaction_hash,))
        con.commit()
    except Exception as error_msg:
        logger.debug(f"Could not save {transaction_hash} (probably already saved)")
        logger.debug(error_msg)
    
    #Get and return the hash
    sql = f"SELECT id FROM transaction_hashes WHERE transaction_hash='{transaction_hash}';"
    with con:
        data = con.execute(sql)
        logger.debug(f"sql data: {data}")
    data = data.fetchone()[0]
    con.close()
    return data