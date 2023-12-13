from decouple import config
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
from loguru import logger

import rpc_files.get_block
import rpc_files.get_block_count
import rpc_files.get_block_hash

#Import all environment variables for RPC:
rpc_username = config('rpc_username')
rpc_password = config('rpc_password')
rpc_port = config('rpc_port')
rpc_url = config('rpc_url')

logger.debug("Imports done!")

rpc_connection = AuthServiceProxy(f"http://{rpc_username}:{rpc_password}@{rpc_url}:{rpc_port}", timeout=120)

#########################
##DEFAULT RPC ENDPOINTS##
#########################
##Blockchain RPCs
# getbestblockhash

# getblock
def get_block(block_hash):
    return rpc_files.get_block.main(rpc_connection, block_hash)
    # pass

# getblockchaininfo

# getblockcount
def get_block_count():
    return rpc_files.get_block_count.main(rpc_connection)

# getblockfilter

# getblockhash
def get_block_hash(block_number):
    return rpc_files.get_block_hash.main(rpc_connection, block_number)

# getblockheader

# getblockstats

# getchaintips

# getchaintxstats

# getdifficulty

# getmempoolancestors

# getmempooldescendants

# getmempoolentry

# getmempoolinfo

# getrawmempool

# gettxout

# gettxoutproof

# gettxoutsetinfo

# preciousblock

# pruneblockchain

# savemempool

# scantxoutset

# verifychain

# verifytxoutproof

##Rawtransactions RPCs
# analyzepsbt
# combinepsbt
# combinerawtransaction
# converttopsbt
# createpsbt
# createrawtransaction
# decodepsbt
# decoderawtransaction
# decodescript
# finalizepsbt
# fundrawtransaction
# getrawtransaction
# joinpsbts
# sendrawtransaction
# signrawtransactionwithkey
# testmempoolaccept
# utxoupdatepsbt

##Wallet RPCs
# abandontransaction
# abortrescan
# addmultisigaddress
# backupwallet
# bumpfee
# createwallet
# dumpprivkey
# dumpwallet
# encryptwallet
# getaddressesbylabel
# getaddressinfo
# getbalance
# getbalances
# getnewaddress
# getrawchangeaddress
# getreceivedbyaddress
# getreceivedbylabel
# gettransaction
# getunconfirmedbalance
# getwalletinfo
# importaddress
# importdescriptors
# importmulti
# importprivkey
# importprunedfunds
# importpubkey
# importwallet
# keypoolrefill
# listaddressgroupings
# listlabels
# listlockunspent
# listreceivedbyaddress
# listreceivedbylabel
# listsinceblock
# listtransactions
# listunspent
# listwalletdir
# listwallets
# loadwallet
# lockunspent
# psbtbumpfee
# removeprunedfunds
# rescanblockchain
# send
# sendmany
# sendtoaddress
# sethdseed
# setlabel
# settxfee
# setwalletflag
# signmessage
# signrawtransactionwithwallet
# unloadwallet
# upgradewallet
# walletcreatefundedpsbt
# walletlock
# walletpassphrase
# walletpassphrasechange
# walletprocesspsbt

####################
##Custom functions##
####################