import axios from "axios";

/**
 * Common API Request Handler
 *
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - Full endpoint URL
 * @param {object|FormData|null} reqBody - Request payload
 * @param {object} reqHeader - Optional custom headers
 */
const commonApi = async (method, url, reqBody = null, reqHeader = {}) => {
  try {
    // 🔐 Get token
    const token = sessionStorage.getItem("token");

    // 🛠️ Axios configuration
    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...reqHeader,
      },
      withCredentials: true, // ✅ Important for auth & Google login
    };

    // 📦 Attach body (only if not GET)
    if (config.method !== "get" && reqBody !== null) {
      config.data = reqBody;
    }

    // 🚀 Execute request
    const response = await axios(config);
    return response;

  } catch (error) {
    console.error(`❌ API Error [${method.toUpperCase()} ${url}]`, error);

    return {
      status: error.response?.status || 500,
      data: error.response?.data || {
        message: "Network error or server unreachable",
      },
    };
  }
};

export default commonApi;
