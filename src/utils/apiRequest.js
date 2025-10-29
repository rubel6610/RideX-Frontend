import api from "./api";


export const apiRequest = async (endpoint, method = "GET", data = {}, params = {}) => {
  try {
    const res = await api.request({
      url: endpoint,
      method,
      data,
      params,
    });
    return res.data;
  } catch (error) {
    // ✅ Enhanced error handling
    const errorDetails = {
      endpoint,
      method,
      message: error.message || 'Unknown error',
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    };

    // Only log if there's actual error data
    if (error.response?.data && Object.keys(error.response.data).length > 0) {
      console.error("❌ API Error:", errorDetails);
    } else if (error.message) {
      console.error("❌ API Error:", error.message, `[${method} ${endpoint}]`);
    } else {
      console.error("❌ API Error: Unknown error occurred", `[${method} ${endpoint}]`);
    }
    
    throw error;
  }
};
