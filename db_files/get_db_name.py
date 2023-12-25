def main(address):
    db_name = address
    if (db_name != "Mining reward" and db_name != "non-standard"):
        db_name = address[:2]
    return db_name