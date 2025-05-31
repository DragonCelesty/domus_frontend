import axios from 'axios';
import { useUserStore } from '../store/userStore';  

const API = import.meta.env.VITE_API_URL as string;

const axiosInstance = axios.create({
  baseURL: API,
});

axiosInstance.interceptors.request.use(
    (config) => {
      const token = useUserStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default axiosInstance;