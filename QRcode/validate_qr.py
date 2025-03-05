"""
validate_qr.py

This script scans and validates QR codes in the blockchain-based ticketing system.
It verifies the ticket details on-chain and ensures the QR code is up-to-date.

Features:
- Extracts hashed NetID, ticket ID, and nonce from the QR code.
- Checks if the ticket is valid by querying the blockchain smart contract.
- Ensures tickets cannot be reused fraudulently.

Author: Mohamad Ali Hamadi
"""

import qrcode
import json
from web3 import Web3

# Connect to blockchain
PRIVATE_NETWORK_URL = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(PRIVATE_NETWORK_URL))

# Smart contract details
CONTRACT_ADDRESS = "0xYourSmartContractAddressHere"
ABI = [...]  # Replace with our actual contract ABI

contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

def validate_ticket_qr(qr_code_path):
    """Validates the scanned QR code against the smart contract."""
    # Read QR Code data
    qr = qrcode.Image.open(qr_code_path)
    qr_data = json.loads(qr.data.decode())

    hashed_netid = qr_data["hashed_netid"]
    ticket_id = qr_data["ticket_id"]
    nonce = qr_data["nonce"]  # This changes every minute

    # Check blockchain for ticket validity
    stored_ticket_id = contract.functions.getTicket(hashed_netid).call()

    if stored_ticket_id == ticket_id:
        print(f"Ticket ID {ticket_id} is valid! Nonce: {nonce}")
        return True
    else:
        print("Invalid ticket! Possible fraud attempt.")
        return False

# Example Usage
validate_ticket_qr("ticket_101.png")
