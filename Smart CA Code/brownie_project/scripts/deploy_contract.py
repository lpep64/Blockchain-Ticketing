import time
from brownie import TicketingSystem, accounts

def main():
    # Use a local account for deployment
    deployer = accounts[0]
    
    # Deploy the contract
    contract = TicketingSystem.deploy({"from": deployer})
    
    # Output the contract address
    print(f"Contract deployed at address: {contract.address}")

