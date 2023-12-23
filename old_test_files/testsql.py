import db

# hash = db.save_hash("test3")
# print(hash)
# hash = db.save_hash("test4")
# print(hash)

# addy = db.save_address("addy")
# print(addy)

# db.save_transaction(50, "test4", "test3", 10, "hash5")

# print("Trying to print all")
# db.print_all("test3")
address = "test4"
print(f"getting outgoing for {address}")
outgoing_balance = db.get_balance_from(address,0,100)
print(f"Outgoing: {outgoing_balance}")
print(f"getting incoming for {address}")
incoming_balance = db.get_balance_to(address,0,100)
print(f"Incoming: {incoming_balance}")

print(f"Getting full balance for {address}")
balance = db.check_balance(address)
print(f"{address}: {balance} BTC")