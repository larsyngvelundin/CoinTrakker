from loguru import logger
def main(con):
    logger.debug("test")
    return con.getblockcount()