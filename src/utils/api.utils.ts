import { API_BASE_URL } from "@constants";
import axios from "axios";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        config.headers.Authorization = authToken;
      }
      // FormData must be sent as multipart/form-data; let the browser set Content-Type with boundary
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );