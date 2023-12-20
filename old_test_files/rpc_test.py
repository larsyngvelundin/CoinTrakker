# tx = "87b365eda169bdd2f1432c1c516a4237ff73c8d7abfb62d8bc85142660294905"

import rpc
import db
import convert

import sys
from loguru import logger

logger.remove()
logger.add(sys.stderr, level="INFO")
logger.add("ct.log", rotation="500 MB")

# test = rpc.parse_transaction_data(tx)

# block = 821747

# for recipient in test['to']:
#     db.save_transaction(test['to'][recipient], recipient, test['from'], block, tx)
#     bal = db.check_balance(recipient)

# print(f"Full transaction:\n{test}")
# print(f"Balance: {bal}")

# rpc.parse_blocks(2634,2634)
# rpc.parse_blocks(2922,2922)
# rpc.parse_blocks(222453,222453)

# balance = convert.to_btc(db.check_balance("1ExF15z6YxFrNZHcnH2sYohbKBh47b1aow"))
# print(f"Balance: {balance}")