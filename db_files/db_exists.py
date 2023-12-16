import os.path

def main(address):
    file_path = f"local_db/incoming/{address}.db"
    return os.path.isfile(file_path)