from loguru import logger

import db
import rpc


def main(from_block, to_block):
    for i in range(from_block, to_block+1):
        block_hash = rpc.get_block_hash(i)
        if i: #If block height is > 0, aka not Genesis
            logger.debug("Checking non-Genesis block")
            block = rpc.get_block(block_hash)
            try:
                transaction_count = len(block['tx'])
            except Exception:
                transaction_count = 0
            logger.info(f"Block: {i} with {transaction_count} transactions")
            logger.debug(block)
            for key in block.keys():
                # logger.debug(f"{key}: {block[key]}")
                pass
            for txhash in block['tx']:
                logger.debug(f"Checking new transaction hash\n{txhash}")
                # logger.debug(f"Current hash: {txhash}")
                # raw_transaction = rpc.get_raw_transaction(txhash)
                transaction_data = rpc.parse_transaction_data(txhash)
                for recipient in transaction_data['to']:
                    db.save_transaction(transaction_data['to'][recipient], recipient, transaction_data['from'], i, txhash)
                if (transaction_data['fee']):
                    db.save_transaction(transaction_data['fee'], "Network Fee", transaction_data['from'], i, txhash)
          
        else: #if Genesis
            
            logger.debug("Checking the Genesis block")
            block = rpc.get_block(block_hash)
            for key in block.keys():
                logger.debug(f"{key}: {block[key]}")
