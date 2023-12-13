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


# rpc_connection = AuthServiceProxy(f"http://{rpc_username}:{rpc_password}@{rpc_url}:{rpc_port}", timeout=120)
# best_block_hash = rpc_connection.getbestblockhash()
# print(rpc_connection.getblock(best_block_hash))
# print(rpc_connection.getinfo())

# block_count = rpc_connection.getblockcount()
# print(f'Current block count: {block_count}')

bn = rpc.get_block_count()
logger.debug(bn)