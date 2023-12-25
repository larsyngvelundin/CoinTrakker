import base58
import hashlib
from loguru import logger

def main(pubkey_hex):
    try:
        pubkey_bytes = bytes.fromhex(pubkey_hex)
        sha256 = hashlib.sha256(pubkey_bytes).digest()
        ripemd160 = hashlib.new('ripemd160', sha256).digest()
        extended = b'\x00' + ripemd160 
        checksum = hashlib.sha256(hashlib.sha256(extended).digest()).digest()[:4]
        address_bytes = extended + checksum
        address = base58.b58encode(address_bytes)
        return address.decode()
    except ValueError as error_msg:
        logger.error(error_msg)
        logger.debug("Most likely a non-standard recipient")
        return "non-standard"