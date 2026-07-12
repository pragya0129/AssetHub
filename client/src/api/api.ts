import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,

  headers: {
    "Content-Type": "application/json",
  },
});


// Add JWT automatically
// before every API request

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "assetflow_token",
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);


export default api;