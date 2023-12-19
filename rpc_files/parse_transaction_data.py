from loguru import logger

import convert
import rpc

def main(transaction_hash):
    logger.info(f"Checking new transaction hash\n{transaction_hash}")
    raw_transaction = rpc.get_raw_transaction(transaction_hash)
    decoded_transaction = rpc.decode_raw_transaction(raw_transaction)
    logger.debug(f"Decoded: {decoded_transaction}")
    parsed = {}
    parsed['transaction_hash'] = transaction_hash
    sender = rpc.get_sender_address(transaction_hash)
    parsed['from'] = sender
    total_amount = 0
    parsed['to'] = {}
    for item in decoded_transaction['vout']:
        try:
            logger.debug(f"{item}")
            to_address = item['scriptPubKey']['address']
            amount = convert.to_sats(item['value'])
            logger.debug(f"{amount}")
            logger.info(f"{convert.to_btc(amount)} BTC to {to_address}")
            parsed['to'][to_address] = amount
            total_amount += amount
        except KeyError:
            logger.debug(f"Item: {item}")
            logger.debug("No plain address address found")
            try:
                pubkey = item['scriptPubKey']['asm'].split(" ")[0]
                to_address = rpc.get_address_from_pubkey(pubkey)
                amount = convert.to_sats(item['value'])
                logger.debug(f"{amount}")
                logger.info(f"{convert.to_btc(amount)} BTC sent to {to_address}")
                parsed['to'][to_address] = amount
                total_amount += amount
            except KeyError:
                logger.error("Could not find any address for this transaction")
                logger.info(f"Transaction vout:\n{decoded_transaction['vout']}")
    parsed['amount'] = total_amount
    parsed['fee'] = convert.to_sats(rpc.get_fee(transaction_hash))
    logger.debug(parsed)
    return parsed

    
#dict?
    #transaction_hash = hash
    #amount = int
    #from = address
    #to = {}
        #address: amount