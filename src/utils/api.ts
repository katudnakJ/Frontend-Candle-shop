import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import liff from "@line/liff";
import { appConfig } from "../config/appConfig";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Status } from "@/types/response.type";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import toast from "react-hot-toast";

let isToastShowing = false;
let isRedirecting = false;

let reloginPromise: Promise<void> | null = null;

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

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

// ใช้สำหรับ silent relogin เมื่อ access token หมดอายุ และ refresh token ยังไม่หมดอายุ
async function silentReloginWithLiff() {

  try {
    await liff.init({ 
      liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID as string 
    });
  } catch (initError) {
    console.error("LIFF Init failed in Interceptor:", initError);
    throw initError;
  }

  if (!liff.isLoggedIn()) {
    throw new Error("LIFF is not logged in");
  }

  const token = liff.getAccessToken();
  if (!token) {
    throw new Error("No LIFF access token");
  }

  const cfg: RetryConfig = {
    headers: AxiosHeaders.from({
      Authorization: `Bearer ${token}`,
    }),
    skipAuthRefresh: true,
  };

  await apiClient.post("/v1/login", {}, cfg);
}

apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = hasSnakeCaseKey(response.data)
        ? camelizeKeys(response.data)
        : response.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    const currentPath = window.location.pathname;
    const originalConfig = error.config as RetryConfig | undefined;
    const is401 = error.response?.status === 401;

    if (process.env.NODE_ENV === "development") {
      console.log("[Interceptor] Error Status:", error.response?.status);
    }
   
    if (
      is401 &&
      originalConfig &&
      !originalConfig._retry &&
      !originalConfig.skipAuthRefresh
    ) {
      originalConfig._retry = true;

      try {
        if (process.env.NODE_ENV === "development") {
          console.log("Attempting Silent Login...");
        }
        if (!reloginPromise) {
          reloginPromise = silentReloginWithLiff().finally(() => {
            reloginPromise = null;
          });
        }

        await reloginPromise;
        if (process.env.NODE_ENV === "development") {
          console.log("Silent Login Success! Retrying original request...");
        }
        return apiClient(originalConfig);
      } catch (reloginError) {
        if (process.env.NODE_ENV === "development") {
          console.error("❌ Silent login failed", reloginError);
        }
      }
    }
    if (is401) {
      if (isRedirecting) {
        console.log("[Interceptor] Already redirecting, ignoring this 401");
        return Promise.reject(error);
      }

      if (currentPath !== "/") {
        isRedirecting = true;
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[Interceptor] Session Expired. Showing Toast and Redirecting...",
          );
        }
        if (!isToastShowing) {
          isToastShowing = true;
          toast.error("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่", {
            id: "auth-error",
          });
        }
        if (process.env.NODE_ENV === "development") {
          console.log("Redirecting to login page...");
        }
        useAuthStoreUserLogin.getState().logout();

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("[Interceptor] Already at home, no redirect needed.");
        }
      }

      return Promise.reject(error);
    }

    // Normalize error payload (รองรับทั้ง snake_case / camelCase)
    const rawData = error.response?.data;
    const parsedData =
      rawData && hasSnakeCaseKey(rawData) ? camelizeKeys(rawData) : rawData;

    const statusNode = parsedData as Status;

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
    if (process.env.NODE_ENV === "development") {
      console.error("⚠️ [Interceptor] Other Error:", error.response?.data || error.message);
    }
    return Promise.reject(err);
  },
);

export { apiClient };
