import api from "./api";


export const apiRequest = async (endpoint, method = "GET", data = {}, params = {}) => {
  try {
    // Filter out empty or undefined parameters
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    );

    const res = await api.request({
      url: endpoint,
      method,
      data,
      params: filteredParams,
    });
    return res.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
