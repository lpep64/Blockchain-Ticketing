from brownie import TicketingSystem, accounts
import hashlib

def hash_netid(netid):
    """Hash the NetID with SHA-256."""
    return hashlib.sha256(netid.encode()).hexdigest()

def main():
    # Prompt for a NetID
    netid = input("Enter NetID: ")
    
    # Assume the NetID is valid (for this test)
    print(f"Assuming NetID '{netid}' is valid.")
    
    # Hash the NetID
    hashed_netid = hash_netid(netid)
    hashed_bytes = bytes.fromhex(hashed_netid)
    print(f"Hashed NetID (hex): {hashed_netid}")
    
    # Deploy the contract and generate a ticket with the hashed NetID
    deployer = accounts[0]
    ticketing_system = TicketingSystem.deploy({"from": deployer})
    tx = ticketing_system.generateTicket(hashed_bytes, {"from": deployer})
    tx.wait(1)  # Wait for transaction to complete
    
    # Retrieve the ticket ID from the contract
    ticket_id = ticketing_system.getTicket(hashed_bytes)
    print(f"Generated ticket ID for hashed NetID '{hashed_netid}': {ticket_id}")
    
    # Verification: compare stored hash with our generated hash
    stored_ticket_id = ticketing_system.getTicket(hashed_bytes)
    if stored_ticket_id == ticket_id:
        print("Test passed: The ticket ID matches the expected result.")
    else:
        print("Test failed: The ticket ID does not match.")
