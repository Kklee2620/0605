// In a real CRA or Vite app, you'd use environment variables like process.env.REACT_APP_API_URL
// For the current setup (CDN, no build process), we'll hardcode it or make it configurable here.
// When backend runs on port 3001, and frontend on port 5173 (via Vite)
export const API_BASE_URL = 'http://localhost:3001';
export const JWT_LOCAL_STORAGE_KEY = 'modernstore-jwt';
