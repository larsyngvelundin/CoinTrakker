from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
from decouple import config
from loguru import logger

#Blockchain
import rpc_files.get_block
import rpc_files.get_block_count
import rpc_files.get_block_hash

#Rawtransactions RPCs
import rpc_files.decode_raw_transaction
import rpc_files.get_raw_transaction

#Wallet
import rpc_files.create_wallet
import rpc_files.get_received_by_address

#Custom
import rpc_files.get_address_from_pubkey
import rpc_files.get_fee
import rpc_files.get_recipient_addresses
import rpc_files.get_sender_address
import rpc_files.parse_blocks
import rpc_files.parse_transaction_data

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
def get_block(block_hash, verbosity=1):
    return rpc_files.get_block.main(rpc_connection, block_hash, verbosity=verbosity)
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
def decode_raw_transaction(raw_transaction):
    return rpc_files.decode_raw_transaction.main(rpc_connection, raw_transaction)

# decodescript
# finalizepsbt
# fundrawtransaction

# getrawtransaction
def get_raw_transaction(tx_hash, detailed=False):
    return rpc_files.get_raw_transaction.main(rpc_connection, tx_hash, detailed=detailed)

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
def create_wallet(name):
    return rpc_files.create_wallet.main(rpc_connection, name)

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
def get_received_by_address(address):
    return rpc_files.get_received_by_address.main(rpc_connection, address)

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

# getbalanceaddress
#def get_balance_address(address, block="latest"):
#   if(block == "latest"):
#       
#   return db.check_balance(address, block=block)

# getrewardrecipient
#def get_reward_recipient(transaction_hash):


# getaddressfrompubkey
def get_address_from_pubkey(pubkey_hex):
    return rpc_files.get_address_from_pubkey.main(pubkey_hex)

#getfee
def get_fee(transaction_hash):
    return rpc_files.get_fee.main(transaction_hash)

# getrecipientaddresses
def get_recipient_addresses(transaction_hash):
    return rpc_files.get_recipient_addresses.main(rpc_connection, transaction_hash)

# getsenderaddress
def get_sender_address(transaction_hash):
    return rpc_files.get_sender_address.main(rpc_connection, transaction_hash)

#parseblocks
def parse_blocks(from_block, to_block):
    rpc_files.parse_blocks.main(from_block, to_block)

#parsetransactiondata
def parse_transaction_data(transaction_hash):
    return rpc_files.parse_transaction_data.main(transaction_hash)