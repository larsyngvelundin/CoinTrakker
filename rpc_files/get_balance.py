from loguru import logger
def main(con, block_hash):
    logger.debug("test")
    return con.getbalance(dummy="*", minconf=0, include_watchonly=True)