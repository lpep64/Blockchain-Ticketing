import hashlib

def hash_netid(netid):
    """Hashes the NetID using SHA-256."""
    return hashlib.sha256(netid.encode()).hexdigest()

if __name__ == "__main__":
    # Replace 'YourNetID' with the actual NetID you want to hash
    netid = 'maa20002'  # "YourNetID"
    hashed_netid = hash_netid(netid)
    print(f"Original NetID: {netid}")
    print(f"Hashed NetID: {hashed_netid}")
