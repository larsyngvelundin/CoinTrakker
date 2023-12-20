from loguru import logger
import sqlite3

def main(address):
    logger.debug("test")
    con = sqlite3.connect("local_db/addresses.db")
    #Try to save the address
    try:
        
        sql = f'INSERT INTO addresses (address) VALUES (?)'
        cursor = con.cursor()
        cursor.execute(sql, (address,))
        con.commit()
    except Exception as error_msg:
        logger.debug(f"Could not save {address} (probably already saved)")
        logger.debug(error_msg)
    sql = f"SELECT id FROM addresses WHERE address='{address}';"
    #Get and return the address
    with con:
        data = con.execute(sql)
        logger.debug(f"sql data: {data}")
    data = data.fetchone()[0]
    con.close()
    return data
