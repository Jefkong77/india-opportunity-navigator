// Configuration file for API Endpoints
// Clean Vite configuration without Node global variables
const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://your-project-id.mockapi.io/api/v1';
const ACCOUNTS_URL = import.meta.env?.VITE_LOCAL_ACCOUNTS_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  OPPORTUNITIES: `${BASE_URL}/opportunities`,
  ACCOUNTS: `${ACCOUNTS_URL}/users`,
  // You can easily add more endpoints here later, for example:
  // USERS: `${BASE_URL}/users`,
};
