from loguru import logger
def main(con, block_hash, verbosity=1):
    logger.debug("test")
    return con.getblock(block_hash, verbosity)