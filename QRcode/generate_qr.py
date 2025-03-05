"""
generate_qr.py

This script generates a dynamic QR code for ticket validation in the blockchain-based ticketing system.
The QR code updates every 60 seconds to prevent screenshot reuse.

Features:
- Hashes the NetID for security before embedding it in the QR code.
- Generates a new QR code every minute while keeping the same ticket ID.
- Stores only the hashed NetID and ticket ID on the blockchain.

Author: Mohamad Ali Hamadi
"""


import qrcode
import hashlib
import json
import time
import random
from web3 import Web3

# Connect to the private blockchain
PRIVATE_NETWORK_URL = "http://127.0.0.1:7545"  # Replace with our network RPC URL
web3 = Web3(Web3.HTTPProvider(PRIVATE_NETWORK_URL))

# Smart contract details
CONTRACT_ADDRESS = "0xYourSmartContractAddressHere"  # Replace with deployed contract address
ABI = [...]  # Your smart contract ABI

contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

def generate_dynamic_qr(netid, ticket_id):
    """Generates a QR code that refreshes every minute but keeps the same ticket ID."""
    hashed_netid = hashlib.sha256(netid.encode()).hexdigest()

    while True:
        # Generate a random nonce to prevent QR reuse (but keep the ticket ID the same)
        nonce = random.randint(100000, 999999)

        # Create ticket data including the nonce
        ticket_data = {
            "hashed_netid": hashed_netid,
            "ticket_id": ticket_id,
            "nonce": nonce  # Ensures the QR code changes every time
        }

        # Convert to JSON and encode
        ticket_json = json.dumps(ticket_data)

        # Generate QR code
        qr = qrcode.make(ticket_json)

        # Save QR code as an image (overwrite previous)
        qr.save(f"ticket_{ticket_id}.png")

        print(f"New QR code for Ticket ID {ticket_id} generated. Refreshing in 60 seconds...")

        # Wait 60 seconds before generating a new QR code
        time.sleep(60)

# Example usage
generate_dynamic_qr("student123", 101)
