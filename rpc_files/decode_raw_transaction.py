from loguru import logger
def main(con, raw_transaction):
    logger.debug("test")
    return con.decoderawtransaction(raw_transaction)