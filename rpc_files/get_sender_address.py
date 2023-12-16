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
        sender_address = prev_tx_decoded['vout'][vout_index]['scriptPubKey']['address']
        logger.debug(f"Sender addresses: {sender_address}")
        return sender_address