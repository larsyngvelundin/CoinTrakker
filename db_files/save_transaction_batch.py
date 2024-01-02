from loguru import logger
import sqlite3


def main(parsed_transactions, block):
    logger.debug("Saving batch")
    con = sqlite3.connect("local_db/transactions.db")

    transaction_list = []
    for transaction in parsed_transactions:

        for recipient in transaction['to']:
            
            fixed_tx = [
                transaction['to'][recipient],
                transaction['from'],
                recipient,
                block,
                transaction['transaction_hash'],
                f"{transaction['from']}-{recipient}-{transaction['transaction_hash']}"]

            transaction_list.append(fixed_tx)

    try:
        cursor = con.cursor()
        cursor.executemany(f"""INSERT INTO transactions (amount, from_address, to_address, block, transaction_hash, UID) VALUES (?,?,?,?,?,?)""",
                                transaction_list)
        con.commit()
        con.close()
    except sqlite3.IntegrityError as error_msg:
        logger.info("Probably already saved this block")
        logger.info(f"SQLite3: {error_msg}")
        