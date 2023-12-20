from loguru import logger
import sys

import rpc

logger.remove()
logger.add(sys.stderr, level="INFO")
logger.add("ct.log", rotation="500 MB", level="DEBUG")

def main():
    if len(sys.argv) != 3:
        print("add to_block and from_block")
        sys.exit(1)

    try:
        num1 = int(sys.argv[1])
        num2 = int(sys.argv[2])
    except ValueError:
        logger.error("arguments were not numbers")

    rpc.parse_blocks(num1, num2)

if __name__ == "__main__":
    main()