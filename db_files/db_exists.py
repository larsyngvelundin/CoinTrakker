from loguru import logger
import os.path

import db

def main(address):
    logger.debug("db_exists (defunct)")
    # file_path = f"local_db/incoming.db"
    # if(os.path.isfile(file_path) == False):
    #     return False
    # db.create_db(address)
    return True