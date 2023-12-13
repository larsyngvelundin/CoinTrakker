from decouple import config
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException


#Import all environment variables:
rpc_username = config('rpc_username')
rpc_password = config('rpc_password')
rpc_port = config('rpc_port')
rpc_url = config('rpc_url')

print("Imports done!")


rpc_connection = AuthServiceProxy(f"http://{rpc_username}:{rpc_password}@{rpc_url}:{rpc_port}")
best_block_hash = rpc_connection.getbestblockhash()
print(rpc_connection.getblock(best_block_hash))