from decouple import config
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
from loguru import logger
import sys

import db
import rpc

logger.remove()
logger.add(sys.stderr, level="INFO")
logger.add("ct.log", rotation="500 MB")

#Import all environment variables:
rpc_username = config('rpc_username')
rpc_password = config('rpc_password')
rpc_port = config('rpc_port')
rpc_url = config('rpc_url')

logger.debug("Imports done!")


rpc_connection = AuthServiceProxy(f"http://{rpc_username}:{rpc_password}@{rpc_url}:{rpc_port}", timeout=120)


#make functions that loop through the blocks to find outliers



# best_block_hash = rpc_connection.getbestblockhash()
# print(rpc_connection.getblock(best_block_hash))
# print(rpc_connection.getinfo())

# block_count = rpc_connection.getblockcount()
# print(f'Current block count: {block_count}')

#Get Block Count
block_count = rpc.get_block_count()
logger.debug(block_count)
assert isinstance(block_count, int)

#Get Block Hash from Block Number
# block_hash = rpc.get_block_hash(0)
# logger.debug(block_hash)

#Get Block from Hash
for i in range(0, 5):
    block_hash = rpc.get_block_hash(i)
    logger.info(f"Block: {i}")
    # logger.debug(block_hash)
    if i: #If block height is > 0, aka not Genesis
        logger.info("Checking non-Genesis block")
        block = rpc.get_block(block_hash)
        logger.debug(block)
        for key in block.keys():
            # logger.debug(f"{key}: {block[key]}")
            pass
        for txhash in block['tx']:
            logger.info(f"Checking new transaction hash\n{txhash}")
            # logger.debug(f"Current hash: {txhash}")
            raw_transaction = rpc.get_raw_transaction(txhash)
            # logger.debug(f"Raw: {raw_transaction}")
            decoded_transaction = rpc.decode_raw_transaction(raw_transaction)
            logger.debug(f"Decoded: {decoded_transaction}")
            for key in decoded_transaction:
                if key == "vin":
                    logger.debug(f"{key}: {decoded_transaction[key]}")
                    sender_address = rpc.get_sender_address(decoded_transaction['txid'])
                    total_sent = 0
                    for receiver in decoded_transaction['vout']:
                        total_sent += receiver['value']
                    logger.info(f"{sender_address} sent {total_sent} BTC")

                elif key == "vout":
                    logger.debug(f"{key}: {decoded_transaction[key]}")

                    for item in decoded_transaction[key]:
                        try:
                            logger.debug(f"{item}")
                            logger.info(f"{item['value']} to {item['scriptPubKey']['address']}")
                        except KeyError:
                            logger.debug(f"Item: {item}")
                            logger.debug("No plain address address found")
                            try:
                                pubkey = item['scriptPubKey']['asm'].split(" ")[0]
                                    # pubkey = item
                                recipient_address = rpc.get_address_from_pubkey(pubkey)
                                logger.info(f"{item['value']} rewarded to {recipient_address}")
                            except KeyError:
                                logger.error("Could not find any address for this transaction")
                                logger.info(f"Transaction vout:\n{decoded_transaction[key]}")
                            pass
                else:
                    logger.debug(f"{key}: {decoded_transaction[key]}")
                    pass
    else: #if Genesis
        
        logger.info("Checking the Genesis block")
        block = rpc.get_block(block_hash)
        for key in block.keys():
            logger.info(f"{key}: {block[key]}")

        # break
        # input("stopped after tx")

    # input(f"Stopped after {i}")
# assert isinstance(block_count, int)

#create wallet
# wallet = rpc.create_wallet("wallet")
# logger.debug(wallet)


#Get balance of address
# amount = rpc.get_received_by_address("38XnPvu9PmonFU9WouPXUjYbW91wa5MerL")
# logger.debug(amount)

#random address
#38XnPvu9PmonFU9WouPXUjYbW91wa5MerL
#1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

# print(rpc_connection.getblockchaininfo())