// Vite exposes environment variables on `import.meta.env`
// Variables prefixed with VITE_ are exposed to client-side code.
// See: https://vitejs.dev/guide/env-and-mode.html

// Default to localhost:3001 if the env variable is not set,
// useful for local development if .env file is missed.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const JWT_LOCAL_STORAGE_KEY = 'modernstore-jwt';
