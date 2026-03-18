import axios from "axios";
import { appConfig } from "../config/appConfig";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Status } from "@/types/response.type";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import toast from "react-hot-toast";

let isToastShowing = false;
let isRedirecting = false;

const apiClient = axios.create({
  baseURL: appConfig.localApiEndpointUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// FE -> BE
apiClient.interceptors.request.use((config) => {
  if (config.data && !(config.data instanceof FormData)) {
    config.data = decamelizeKeys(config.data);
  }

  if (config.params) {
    config.params = decamelizeKeys(config.params);
  }

  return config;
});

// BE -> FE
apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = camelizeKeys(response.data);
    }
    return response.data;
  },
  (error) => {
    const currentPath = window.location.pathname;
    if (error.response && error.response.status === 401) {
      if (isRedirecting) {
        return Promise.reject(error);
      }
      isRedirecting = true;

      if (!isToastShowing) {
        isToastShowing = true;
        toast.error("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่", {
          id: "auth-error",
        });
        setTimeout(() => {
          isToastShowing = false;
        }, 3000);
      }
      if (currentPath !== "/") {
        localStorage.removeItem("auth-storage");
        useAuthStoreUserLogin.getState().logout();
      }
      if (currentPath !== "/") {
        setTimeout(() => {
          window.location.href = "/";
          isRedirecting = false;
        }, 1500);
      }else{
        isRedirecting = false ;
      }
      return Promise.reject(error);
    }

    const err: Status = {
      status: error.response?.data?.status,
      message: error.response?.data?.message,
      remark: error.response?.data?.remark,
    };

    if (err.status === undefined) {
      console.log("Carmel Parsing Error Interceptor:", error);
      return Promise.reject(error);
    } else {
      console.log("Carmel Parsing Error Interceptor:", err);
      return Promise.reject(err);
    }
  },
);

export { apiClient };
