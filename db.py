import db_files.check_balance
import db_files.create_db
import db_files.db_exists
import db_files.get_transactions_from
import db_files.get_transactions_to
import db_files.initialize
import db_files.print_all
import db_files.save_address
import db_files.save_hash
import db_files.save_transaction

#have db for addresses
#each address is only used once, and given a unique auto incrementing integer
#there's a .db for address_lookup.
#there's a .db for wallet balances at latest checked block

#Ensure that db folders exists and create them if not

#check_balance(address, block=latest)
def check_balance(address, block=100):
    return db_files.check_balance.main(address, block=block)

#createdb
def create_db(address):
    db_files.create_db.main(address)

#checkifdbexists
def db_exists(address):
   return db_files.db_exists.main(address)

#initialize
def initialize():
    db_files.initialize.main()

#get_transactions_from(from, from_block, to_block)
def get_transactions_from(address, from_block, to_block):
    return db_files.get_transactions_from.main(address, from_block=from_block, to_block=to_block)

#get_transactions_to(from, from_block, to_block)
def get_transactions_to(address, from_block, to_block):
    return db_files.get_transactions_to.main(address, from_block=from_block, to_block=to_block)

#printall
def print_all(db_file):
    db_files.print_all.main(db_file)

#savehash
def save_hash(transaction_hash):
    return db_files.save_hash.main(transaction_hash)

#saveaddress
def save_address(address):
    return db_files.save_address.main(address)

# savetransaction
def save_transaction(amount, to_address, from_address, block, transaction_hash):
    return db_files.save_transaction.main(amount, to_address, from_address, block, transaction_hash)

initialize()