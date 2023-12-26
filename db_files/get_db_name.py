def main(address):
    db_name = address.lower()
    if (db_name != "Mining reward" and db_name != "non-standard" and db_name != "Network Fee"):
        db_name = address.lower()[:3]
    return db_name