from loguru import logger
import os.path

def main(address):
    logger.info("test")
    file_path = f"local_db/incoming/{address}.db"
    return os.path.isfile(file_path)