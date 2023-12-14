from decouple import config
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
import rpc
from loguru import logger
import sys

logger.remove()
logger.add(sys.stderr, level="DEBUG")
logger.add("ct.log", rotation="500 MB")

#Import all environment variables:
rpc_username = config('rpc_username')
rpc_password = config('rpc_password')
rpc_port = config('rpc_port')
rpc_url = config('rpc_url')

logger.debug("Imports done!")


rpc_connection = AuthServiceProxy(f"http://{rpc_username}:{rpc_password}@{rpc_url}:{rpc_port}", timeout=120)
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
block_hash = rpc.get_block_hash(0)
logger.debug(block_hash)

#Get Block from Hash
block = rpc.get_block(block_hash)
logger.debug(block)
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