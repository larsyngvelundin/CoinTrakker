from loguru import logger
def main(con, name):
    logger.debug("test")
    return con.createwallet(name)