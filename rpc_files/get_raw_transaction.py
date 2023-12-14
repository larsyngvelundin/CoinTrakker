from loguru import logger
def main(con, tx_hash):
    logger.debug("test")
    return con.getrawtransaction(tx_hash)