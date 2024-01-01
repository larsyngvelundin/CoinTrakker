from loguru import logger
import sqlite3


def main(parsed_transactions, block):
    logger.debug("Saving batch")
    # con_addr = sqlite3.connect("local_db/addresses.db")
    # con_tran = sqlite3.connect("local_db/transactions_hashes.db")
    con_inco = sqlite3.connect("local_db/incoming.db")
    con_outg = sqlite3.connect("local_db/outgoing.db")

    #preprocess into dict for each address
    incoming_list = {}
    outgoing_list = {}
    for transaction in parsed_transactions:
        del transaction['timing']
        # logger.info(transaction)
        if transaction['from'] not in outgoing_list:
            outgoing_list[transaction['from']] = []
            # logger.info("it was not in the list, added")
        # outgoing_list[transaction['from']].append(transaction)
        # logger.info(f"outgoing_list: {outgoing_list}")



        for recipient in transaction['to']:
            
            fixed_tx_out = [
                transaction['to'][recipient],
                recipient,
                block,
                transaction['transaction_hash'],
                f"{transaction['from']}-{recipient}-{transaction['transaction_hash']}"]
            fixed_tx_in = [
                transaction['to'][recipient],
                transaction['from'],
                block,
                transaction['transaction_hash'],
                f"{transaction['from']}-{recipient}-{transaction['transaction_hash']}"
                ]
            # fixed_tx_in['UID'] = f"{fixed_tx_in['from']}-{fixed_tx_out['to']}-{fixed_tx_in['transaction_hash']}"
            # fixed_tx_out['UID'] = f"{fixed_tx_in['from']}-{fixed_tx_out['to']}-{fixed_tx_out['transaction_hash']}"
            # logger.info(f"fixed_tx : {fixed_tx}")

            if recipient not in incoming_list:
                incoming_list[recipient] = []
                # logger.info("it was not in the list, added")
            outgoing_list[transaction['from']].append(fixed_tx_out)
            incoming_list[recipient].append(fixed_tx_in)
        # logger.info(f"incoming_list: {incoming_list}")



    # input()

    # cur_addr = con_addr.cursor()
    # cur_tran = con_tran.cursor()
    cur_inco = con_inco.cursor()
    cur_outg = con_outg.cursor()

    for address in outgoing_list:
        # logger.info(f"For {address}")
        cur_outg.execute(f"""
            CREATE TABLE if not exists '{address}'(
                amount INTEGER,
                to_address INTEGER,
                block INTEGER,
                transaction_hash INTEGER,
                UID TEXT UNIQUE
            );
        """)
        cur_outg.executemany(f"""INSERT INTO '{address}' (amount, to_address, block, transaction_hash, UID) VALUES (?,?,?,?,?)""",
                             outgoing_list[address])
    
    for address in incoming_list:
        # logger.info(f"For {address}")
        cur_inco.execute(f"""
            CREATE TABLE if not exists '{address}'(
                amount INTEGER,
                to_address INTEGER,
                block INTEGER,
                transaction_hash INTEGER,
                UID TEXT UNIQUE
            );
        """)
        cur_inco.executemany(f"""INSERT INTO '{address}' (amount, to_address, block, transaction_hash, UID) VALUES (?,?,?,?,?)""",
                             incoming_list[address])
        # for transaction in outgoing_list[address]:
        #     logger.info(transaction)
    con_inco.commit()
    con_outg.commit()
    con_inco.close()
    con_outg.close()
    # input()