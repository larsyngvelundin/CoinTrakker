import sqlite3

#Ensure that db folders exists and create them if not


#save_transaction(amount, to, from, block)
    #con = sqlite3.connect("local_db/outgoing/{from}.db")
    #save amount and to and block
    #con = sqlite3.connect("local_db/incoming/{to}.db")
    #save amount and from and block

#check_balance(address, block=latest)
    #check if file exists in local_db/incoming
        #get sum of amount up until block
    #check if file exists in local_deb/outgoing
        #subtract amount from sum up until block