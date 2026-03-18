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

function hasSnakeCaseKey(input: unknown): boolean {
  if (!input || typeof input !== "object") return false;

  if (Array.isArray(input)) {
    return input.some((item) => hasSnakeCaseKey(item));
  }

  const obj = input as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (key.includes("_")) return true;
      if (hasSnakeCaseKey(obj[key])) return true;
    }

return false;
}

apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = hasSnakeCaseKey(response.data) ? camelizeKeys(response.data) : response.data;
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

    // Normalize error payload (รองรับทั้ง snake_case / camelCase)
    const rawData = error.response?.data;
    const parsedData = rawData && hasSnakeCaseKey(rawData) ? camelizeKeys(rawData) : rawData;

    const statusNode = parsedData?.status ?? parsedData;

    const err: Status = {
      statusCode:
        statusNode?.statusCode ??
        (error.response?.status ? String(error.response.status) : "UNKNOWN"),
      message:
        statusNode?.message ??
        error.message ??
        "A connection error occurred. Please try again.",
      remark: statusNode?.remark,
    };

    // debug only development
    if (process.env.NODE_ENV === "development") {
      console.log("throw error from backend", err);
    }

    return Promise.reject(err);
  },
);

export { apiClient };
