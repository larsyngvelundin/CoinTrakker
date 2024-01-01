from loguru import logger
from time import time

import convert
import rpc

def main(transaction_hash):
    parsed = {}
    parsed['timing'] = {}
    parsed['timing']['start'] = time()
    logger.debug(f"Checking new transaction hash\n{transaction_hash}\n########################")
    raw_transaction = rpc.get_raw_transaction(transaction_hash)
    decoded_transaction = rpc.decode_raw_transaction(raw_transaction)
    logger.debug(f"Decoded: {decoded_transaction}")
    parsed['transaction_hash'] = transaction_hash
    sender = rpc.get_sender_address(transaction_hash)
    parsed['from'] = sender
    total_amount = 0
    parsed['to'] = {}
    for item in decoded_transaction['vout']:
        try:
            logger.debug("\n\nChecking new transaction")
            logger.debug(f"{item}")
            to_address = item['scriptPubKey']['address']
            amount = convert.to_sats(item['value'])
            logger.debug(f"Is the sender the recipient? {to_address != sender}")
            if (to_address != sender):
                logger.debug(f"{amount}")
                logger.debug(f"{convert.to_btc(amount)} BTC to {to_address}")
                parsed['to'][to_address] = amount
                total_amount += amount
        except KeyError:
            logger.debug(f"Item: {item}")
            logger.debug("No plain address address found")
            try:
                pubkey = item['scriptPubKey']['asm'].split(" ")[0]
                to_address = rpc.get_address_from_pubkey(pubkey)
                logger.debug(f"Is the sender the recipient? {to_address == sender}")
                if (to_address != sender):
                    amount = convert.to_sats(item['value'])
                    logger.debug(f"{amount}")
                    logger.debug(f"{convert.to_btc(amount)} BTC sent to {to_address}")
                    parsed['to'][to_address] = amount
                    total_amount += amount
            except KeyError:
                logger.error("Could not find any address for this transaction")
                logger.debug(f"Transaction vout:\n{decoded_transaction['vout']}")
    parsed['amount'] = total_amount
    parsed['fee'] = convert.to_sats(rpc.get_fee(transaction_hash))
    logger.debug(parsed)
    parsed['timing']['end'] = time()
    parsed['timing']['vouts'] = len(decoded_transaction['vout'])
    return parsed

    
#dict?
    #transaction_hash = hash
    #amount = int
    #from = address
    #to = {}
        #address: amount