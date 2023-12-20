import rpc

# t = "5c98e15fd2f37006e411d0d8fc7a7b41149678caff0ee06e2fd3bad5621b17fb"
t = "b73dc70009a4d252305f043fc2f82531411f217355e3d28170820bbf79183a55"

rpc.parse_transaction_data(t)

# s = rpc.rpc_connection.getrawtransaction("b73dc70009a4d252305f043fc2f82531411f217355e3d28170820bbf79183a55")
# print(f"simple:\n{s}")

# sdec = rpc.decode_raw_transaction(s)
# print(f"simple decoded:\n{sdec}")

# # for item in sdec['vin']:
# #     print(f"Checking {item['txid']}")
# #     st = rpc.rpc_connection.getrawtransaction(item['txid'], True)
# #     print(f"details:\n{st}")

# input_value = 0
# for vin in sdec['vin']:
#     prev_tx = rpc.rpc_connection.getrawtransaction(vin['txid'], True)
#     prev_out = prev_tx['vout'][vin['vout']]
#     input_value += prev_out['value']
# output_value = sum([vout['value'] for vout in sdec['vout']])
# fee = input_value - output_value
# print(fee)


# import db

# hid = 248
# h = db.get_hash_from_id(hid)
# hid2 = db.get_id_from_hash(h)
# print(f"{hid}\n{h}\n{hid2}")

# aid = 283
# a = db.get_address_from_id(aid)
# aid2 = db.get_id_from_address(a)
# print(f"{aid}\n{a}\n{aid2}")