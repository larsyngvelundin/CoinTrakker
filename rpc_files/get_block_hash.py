from loguru import logger
def main(con, block_number):
    logger.debug("test")
    return con.getblockhash(block_number)