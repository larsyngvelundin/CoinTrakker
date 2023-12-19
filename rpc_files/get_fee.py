from loguru import logger
import rpc

def main(transaction_hash):
    logger.info("Test")
    fee = 0
    try:
        raw_transaction = rpc.get_raw_transaction(transaction_hash)
        decoded_transaction = rpc.decode_raw_transaction(raw_transaction)
        input_value = 0
        for vin in decoded_transaction['vin']:
            prev_tx = rpc.get_raw_transaction(vin['txid'], True)
            prev_out = prev_tx['vout'][vin['vout']]
            input_value += prev_out['value']
        output_value = sum([vout['value'] for vout in decoded_transaction['vout']])
        fee = input_value - output_value
    except KeyError:
        logger.info("Probably no fee")
    return(fee)
