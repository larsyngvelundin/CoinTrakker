from loguru import logger
def main(con, tx_hash, detailed=False):
    logger.debug("test")
    return con.getrawtransaction(tx_hash, detailed)