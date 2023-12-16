from loguru import logger

import rpc_files.get_raw_transaction
import rpc_files.decode_raw_transaction
import rpc_files.get_sender_address

def main(transaction_hash):
    logger.info(f"Checking new transaction hash\n{transaction_hash}")
    raw_transaction = rpc_files.get_raw_transaction(transaction_hash)
    decoded_transaction = rpc_files.decode_raw_transaction(raw_transaction)
    logger.debug(f"Decoded: {decoded_transaction}")
    sender = rpc_files.get_sender_address(transaction_hash)
    


    
#dict?
    #transaction_hash = hash
    #amount = int
    #from = address
    #to = {}
        #address: amount