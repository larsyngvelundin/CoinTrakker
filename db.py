import db_files.create_db
import db_files.db_exists
import db_files.save_transaction

#Ensure that db folders exists and create them if not

#check_balance(address, block=latest)
    #check if file exists in local_db/incoming
        #get sum of amount up until block
        #SUM amount WHERE block LESS THAN {block+1}
    #check if file exists in local_deb/outgoing
        #subtract amount from sum up until block

#checkifdbexists
def db_exists(address):
   return db_files.db_exists.main(address)

#createdb
def create_db(address):
    db_files.create_db.main(address)

#get_transactions_from(from, from_block, to_block)

#get_transactions_to(from, from_block, to_block)

# savetransaction
def save_transaction(amount, to_address, from_address, block, transaction_hash):
    return db_files.save_transaction.main(amount, to_address, from_address, block, transaction_hash)