# Blockchain Ticketing System - Testing Guide

## Overview

Explains how to test the Ticketing System's functionality, specifically the process of validating, hashing, and generating a ticket using a student’s NetID.

## Installs



```bash

## On mac, need venv
source venv/bin/activate


## First, install the Python dependencies:
pip install -r requirements.txt


## Then, install ganache globally using npm:
npm install -g ganache




## Instructions to Run the Test


cd Smart\ CA\ Code/brownie_project

brownie compile

brownie run scripts/test_ticketing_system.py --network development




