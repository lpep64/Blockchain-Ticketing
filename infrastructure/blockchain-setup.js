// Code not complete
import dotenv from 'dotenv'; // Use import statement for dotenv
dotenv.config(); // Load environment variables from .env file

import axios from 'axios'; // Allows the use of HTTP requests for API usage

import computePackage from '@google-cloud/compute'; // Allows for interaction with google cloud compute engine
const { Compute } = computePackage;

const credentials = process.env.VUE_APP_GOOGLE_APP_CRED; // Credentials to use the service account to create blockchain nodes


