from loguru import logger

import rpc

def main(con, block_height):
    logger.debug("test")
    rpc.refresh_rpc_connection()
    block_info = con.getblockstats(block_height)
    block_time = block_info['time']
    return block_time