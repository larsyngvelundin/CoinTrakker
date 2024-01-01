from loguru import logger
from time import time

import db
import rpc


def main(from_block, to_block):
    for i in range(from_block, to_block+1):
        block_hash = rpc.get_block_hash(i)
        if i: #If block height is > 0, aka not Genesis
            timing_data = {'start': time()}
            logger.debug("Checking non-Genesis block")


            ##measure time getting block
            timing_data['get_block'] = {}
            timing_data['get_block']['start'] = time()
            block = rpc.get_block(block_hash)
            try:
                transaction_count = len(block['tx'])
            except Exception:
                transaction_count = 0
            logger.info(f"Block: {i} with {transaction_count} transactions")
            timing_data['get_block']['end'] = time()



            # logger.debug(block)
            # for key in block.keys():
            #     # logger.debug(f"{key}: {block[key]}")
            #     pass

            timing_data['parse_total'] = {}
            timing_data['parse_total']['elapsed'] = 0

            timing_data['db_total'] = {}
            timing_data['db_total']['elapsed'] = 0

            timing_data['txloop'] = {}
            timing_data['txloop']['start'] = time()
            parsed_transactions = []
            for txhash in block['tx']:



                logger.debug(f"Checking new transaction hash\n{txhash}")
                #measure time parsing block and include in transaction_data
                transaction_data = rpc.parse_transaction_data(txhash)
                parsed_transactions.append(transaction_data)
                # logger.info(f"transaction_data: {transaction_data}")
                timing_data['parse_total']['elapsed'] += transaction_data['timing']['end'] - transaction_data['timing']['start']


                #measure total time to save all transactions
                # timing_data['db'] = {}
                # timing_data['db_total']['start'] = time()
                # for recipient in transaction_data['to']:
                #     db.save_transaction(transaction_data['to'][recipient], recipient, transaction_data['from'], i, txhash)
                # if (transaction_data['fee']):
                #     db.save_transaction(transaction_data['fee'], "Network Fee", transaction_data['from'], i, txhash)
                # timing_data['db_total']['end'] = time()
                # timing_data['db_total']['elapsed'] += timing_data['db_total']['end'] - timing_data['db_total']['start']
            # parsed_transactions['block'] = i
            
            timing_data['db_total']['start'] = time()
            db.save_transaction_batch(parsed_transactions, i)
            timing_data['db_total']['end'] = time()

            timing_data['txloop']['end'] = time()
            


            timing_data['end'] = time()
            timing_data['elapsed'] = timing_data['end'] - timing_data['start']

            timing_data['get_block']['elapsed'] = timing_data['get_block']['end'] - timing_data['get_block']['start']
            timing_data['get_block']['percentage'] = timing_data['get_block']['elapsed'] / timing_data['elapsed']

            timing_data['txloop']['elapsed'] = timing_data['txloop']['end'] - timing_data['txloop']['start']
            timing_data['txloop']['percentage'] = timing_data['txloop']['elapsed'] / timing_data['elapsed']

            # timing_data['parse_total'] = {}
            # timing_data['parse_total']['elapsed'] = transaction_data['timing']['end'] - transaction_data['timing']['start']
            timing_data['parse_total']['percentage'] =  timing_data['parse_total']['elapsed'] / timing_data['txloop']['elapsed']

            timing_data['db_total']['elapsed'] = timing_data['db_total']['end'] - timing_data['db_total']['start']
            timing_data['db_total']['percentage'] = timing_data['db_total']['elapsed'] / timing_data['txloop']['elapsed']


            logger.info(timing_data)
            # Write out total times and time per transactions and vout
            logger.info(f"            Total time: {timing_data['elapsed']:.3f}")
            logger.info(f"Getting the block data: {timing_data['get_block']['elapsed']:.3f}    ({(timing_data['get_block']['percentage']*100):.2f}%)")
            logger.info(f"    Looping the hashes: {timing_data['txloop']['elapsed']:.3f}    ({(timing_data['txloop']['percentage']*100):.2f}%)")
            logger.info(f"  Parsing the block data: {timing_data['parse_total']['elapsed']:.3f}    ({(timing_data['parse_total']['percentage']*100):.2f}%)")
            logger.info(f"   Saving the block data: {timing_data['db_total']['elapsed']:.3f}    ({(timing_data['db_total']['percentage']*100):.2f}%)")
            logger.info(f"{timing_data['elapsed']:.3f}\n{timing_data['get_block']['elapsed']:.3f}\n{timing_data['parse_total']['elapsed']:.3f}\n{timing_data['db_total']['elapsed']:.3f}")
          
        else: #if Genesis
            
            logger.debug("Checking the Genesis block")
            block = rpc.get_block(block_hash)
            for key in block.keys():
                logger.debug(f"{key}: {block[key]}")
