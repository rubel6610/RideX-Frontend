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
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
