from loguru import logger
def main(con, address):
    logger.debug("test")
    return con.getreceivedbyaddress(address, 0)