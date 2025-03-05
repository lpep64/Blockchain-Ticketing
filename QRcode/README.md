# Blockchain-Based QR Code Ticket Validation System

This system generates and validates QR codes for a private blockchain ticketing system. QR codes refresh every minute to prevent unauthorized sharing.

## Features
- Generates QR codes linked to unique ticket IDs stored on the blockchain.
- QR codes refresh every minute to prevent screenshots from being reused.
- QR codes are validated against the smart contract before granting access.

---

## Usage

### Run the QR Code Generator
This script generates QR codes for valid tickets stored on the blockchain.

```python
python generate_qr.py
```

### Run the QR Code Validator
This script validates scanned QR codes against the blockchain.

```python
python validate_qr.py
```

## Description

```bash
generate_qr.py
```
* Fetches ticket details from the blockchain.
* Generates a QR code that refreshes every minute with a cryptographic nonce.
* Displays and saves the QR code locally.

```bash
validate_qr.py
```
* Scans and decodes the QR code.
* Checks the validity of the ticket ID stored in the blockchain.
* Ensures the QR code has not expired.

## Security

* Prevents Screenshots: QR codes change every minute, making screenshots ineffective.
* Blockchain Validation: Every ticket ID is verified against the smart contract.
* Cryptographic Security: Uses secure hashing for ticket validation.

## Contact

If you need help integrating this into the private network, contact me,  Mohamad Ali Hamadi.
