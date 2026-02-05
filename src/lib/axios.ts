import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === false) {
      return Promise.reject(response.data.message || "Error");
    }
    return response.data;
  },
  (error) => {
    let errorMessage = "A connection error occurred. Please try again.";
    if (error.response) {

      const serverMessage = error.response?.data?.message;
      switch (error.response?.status) {
        case 400:
          errorMessage = serverMessage || "Bad Request.";
          break;
        case 401:
          errorMessage = "Session expired. Please login again.";
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            localStorage.removeItem("token");
            if (window.location.pathname !== "/login") {
              alert("Session expired. Please login again.");
              window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
            }
            
          }
          break;
        case 403:
          errorMessage = "You do not have permission to access this section.";
          if (typeof window !== "undefined") {
              alert(errorMessage);
              window.location.href = "/";
            }
          break;
        case 404:
          errorMessage = "sorry, the resource you requested was not found.";
          break;
        case 500:
          errorMessage = "Internal Server Error.";
          break;
        default:
          errorMessage = serverMessage || errorMessage;
      }
    } else if (error.request) {
      errorMessage =
        "No response received from server. Please check your network.";
    }
    return Promise.reject(errorMessage);
  },
);

export default axiosInstance;
