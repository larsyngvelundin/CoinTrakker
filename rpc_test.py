tx = "87b365eda169bdd2f1432c1c516a4237ff73c8d7abfb62d8bc85142660294905"

import rpc
import db


test = rpc.parse_transaction_data(tx)

block = 821747

for recipient in test['to']:
    db.save_transaction(test['to'][recipient], recipient, test['from'], block, tx)
    bal = db.check_balance(recipient)

print(f"Full transaction:\n{test}")
print(f"Balance: {bal}")