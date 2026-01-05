// Base backend URL (Render / Local)
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000";

// API root
export const serverURL = `${BASE_URL}/api`;
