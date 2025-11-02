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
    // ✅ Enhanced error handling with better logging
    const hasResponseData = error.response?.data && 
      typeof error.response.data === 'object' && 
      Object.keys(error.response.data).length > 0;

    // Build error details only if we have meaningful data
    const errorDetails = {
      endpoint,
      method,
      message: error.message || error.response?.statusText || 'Unknown error',
      status: error.response?.status,
      ...(hasResponseData && { data: error.response.data })
    };

    // Log based on what information we have
    if (hasResponseData) {
      console.error("❌ API Error:", errorDetails);
    } else if (error.response?.status) {
      console.error(`❌ API Error [${error.response.status}]:`, 
        error.message || error.response.statusText, 
        `[${method} ${endpoint}]`);
    } else if (error.message) {
      console.error("❌ API Error:", error.message, `[${method} ${endpoint}]`);
    } else {
      console.error("❌ Network/API Error:", `[${method} ${endpoint}]`);
    }
    
    throw error;
  }
};
