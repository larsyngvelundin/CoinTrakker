from loguru import logger

def main(con, block_height):
    logger.debug("test")
    block_info = con.getblockstats(block_height)
    block_time = block_info['time']
    return block_time