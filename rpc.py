from decouple import config
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
from loguru import logger

import rpc_files.get_block_count

#Import all environment variables for RPC:
rpc_username = config('rpc_username')
rpc_password = config('rpc_password')
rpc_port = config('rpc_port')
rpc_url = config('rpc_url')

logger.debug("Imports done!")

rpc_connection = AuthServiceProxy(f"http://{rpc_username}:{rpc_password}@{rpc_url}:{rpc_port}", timeout=120)

def get_block_count():
    return rpc_files.get_block_count.main(rpc_connection)