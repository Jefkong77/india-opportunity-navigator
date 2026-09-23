// Configuration file for API Endpoints
// Clean Vite configuration without Node global variables
const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://YOUR_MOCKAPI_URL_HERE';

export const API_ENDPOINTS = {
  OPPORTUNITIES: `${BASE_URL}/opportunities`,
  // You can easily add more endpoints here later, for example:
  // USERS: `${BASE_URL}/users`,
};
