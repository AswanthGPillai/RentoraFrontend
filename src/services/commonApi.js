import axios from "axios";

/**
 * Common API Request Handler
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - The endpoint URL
 * @param {object|FormData} reqBody - The data to be sent
 * @param {object} reqHeader - Custom headers (e.g., for file uploads)
 */
const commonApi = async (method, url, reqBody = null, reqHeader = {}) => {
  try {
    // 🔐 Get token from sessionStorage
    const token = sessionStorage.getItem("token");

    // 🛠️ Build Configuration
    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        // Spread token if it exists
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Spread any custom headers passed (like "Content-Type": "multipart/form-data")
        ...reqHeader,
      },
    };

    // 📦 Attach body for non-GET requests
    if (config.method !== "get" && reqBody !== null) {
      config.data = reqBody;
    }

    // 🚀 Execute Request
    const response = await axios(config);
    return response;

  } catch (error) {
    // 🚦 Centralized Error Handling
    console.error(`API Error [${method.toUpperCase()} ${url}]:`, error);
    
    return {
      status: error.response?.status || 500,
      data: error.response?.data || {
        message: "Network error or server unreachable",
      },
    };
  }
};

export default commonApi;