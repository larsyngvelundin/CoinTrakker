from loguru import logger

import rpc

def main(transaction_hash):
    logger.info(f"Checking new transaction hash\n{transaction_hash}")
    raw_transaction = rpc.get_raw_transaction(transaction_hash)
    decoded_transaction = rpc.decode_raw_transaction(raw_transaction)
    logger.debug(f"Decoded: {decoded_transaction}")
    sender = rpc.get_sender_address(transaction_hash)
    for item in decoded_transaction['vout']:
        try:
            logger.debug(f"{item}")
            logger.info(f"{item['value']} to {item['scriptPubKey']['address']}")
        except KeyError:
            logger.debug(f"Item: {item}")
            logger.debug("No plain address address found")
            try:
                pubkey = item['scriptPubKey']['asm'].split(" ")[0]
                recipient_address = rpc.get_address_from_pubkey(pubkey)
                logger.info(f"{item['value']} rewarded to {recipient_address}")
            except KeyError:
                logger.error("Could not find any address for this transaction")
                logger.info(f"Transaction vout:\n{decoded_transaction[key]}")


    
#dict?
    #transaction_hash = hash
    #amount = int
    #from = address
    #to = {}
        #address: amount