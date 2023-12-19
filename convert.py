def to_sats(btc):
    return int(btc * 10 ** 8)

def to_btc(sats):
    return sats / 10 ** 8