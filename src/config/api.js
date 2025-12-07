/**
 * API Configuration
 * Automatically detects the correct data API endpoint based on the current environment
 */

const getDataApiUrl = () => {
  const hostname = window.location.hostname
  const port = window.location.port;

  // Production environment (Azure Static Web Apps)
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return '/data-api';
  }

  // Local development with SWA CLI (runs on port 4280)
  if (port === '4280') {
    return 'http://localhost:4280/data-api';
  }

  // Local development with npm run serve (port 8080 or 8081)
  // In this case, you need to run the data API separately
  // For now, default to localhost:4280 or the same origin with /data-api
  return 'http://localhost:4280/data-api';
};

export const API_BASE_URL = getDataApiUrl();

export default {
  API_BASE_URL,
  getDataApiUrl
};
