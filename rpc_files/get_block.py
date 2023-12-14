from loguru import logger
def main(con, block_hash):
    logger.debug("test")
    return con.getblock(block_hash)