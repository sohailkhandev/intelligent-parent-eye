import { API_BASE_URL } from "@constants";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { getErrorMessage } from "./error.utils";

type ApiSuccessPayload = {
  message?: string;
  status?: string;
  data?: {
    message?: string;
  };
};

const getSuccessToastMessage = (
  response: AxiosResponse<ApiSuccessPayload>,
): string | null => {
  const method = response.config.method?.toUpperCase();
  const payload = response.data;

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (
    payload?.data &&
    typeof payload.data.message === "string" &&
    payload.data.message.trim()
  ) {
    return payload.data.message;
  }

  switch (method) {
    case "POST":
      return "Request completed successfully.";
    case "PUT":
    case "PATCH":
      return "Updated successfully.";
    case "DELETE":
      return "Deleted successfully.";
    default:
      return null;
  }
};

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
    (response) => {
      const successMessage = getSuccessToastMessage(response);

      if (successMessage) {
        toast.success(successMessage);
      }

      return response;
    },
    (error) => {
      toast.error(getErrorMessage(error));
      return Promise.reject(error);
    }
  );