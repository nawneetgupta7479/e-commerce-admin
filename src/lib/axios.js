import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// This will be set from a component that has access to Clerk
let getTokenFn = null;

export const setGetTokenFn = (fn) => {
  getTokenFn = fn;
};

// Add request interceptor to automatically add auth header
axiosInstance.interceptors.request.use(
  async (config) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add default export as well
export default axiosInstance;
export { axiosInstance };
