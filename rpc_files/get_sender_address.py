from loguru import logger
import rpc
def main(con, transaction_hash):
    raw_transaction = rpc.get_raw_transaction(transaction_hash)
    decoded_transaction = rpc.decode_raw_transaction(raw_transaction)
    if 'coinbase' in decoded_transaction['vin'][0].keys():
        logger.debug("THIS IS A BLOCKREWARD")
        return("Mining reward")
    for item in decoded_transaction['vin']:
        prev_tx_hash = item['txid']
        vout_index = item['vout']
        prev_tx = rpc.get_raw_transaction(prev_tx_hash)
        prev_tx_decoded = rpc.decode_raw_transaction(prev_tx)
        logger.debug(f"Decoded prev: \n{prev_tx_decoded}")
        try:
            logger.debug(f"vout: {prev_tx_decoded['vout']}")
            logger.debug(f"vout[{vout_index}]: {prev_tx_decoded['vout'][vout_index]}")
            sender_address = prev_tx_decoded['vout'][vout_index]['scriptPubKey']['address']
            logger.debug(f"Sender addresses: {sender_address}")
        except KeyError as error_msg:
            logger.debug("No plain address address found")
            try:
                logger.debug(f"Trying to access {prev_tx_decoded}")
                pubkey = prev_tx_decoded['vout'][vout_index]['scriptPubKey']['asm'].split(" ")[0]
                logger.debug("Trying")
                sender_address = rpc.get_address_from_pubkey(pubkey)
                logger.debug("Trying")
                # amount = prev_tx_decoded['value']
                logger.debug("Trying")
                # logger.info(f"{prev_tx_decoded['value']} rewarded to {to_address}")
                # parsed['to'][to_address] = amount
                # total_amount += amount
            except KeyError as error_msg:
                logger.error("Could not find any address for this transaction")
                logger.error(error_msg)
                logger.info(f"Transaction vout:\n{decoded_transaction['vout']}")
        return sender_address