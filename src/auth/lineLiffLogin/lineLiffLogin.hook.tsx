"use client";

import { ROUTE } from "@/constants/routes";
import { useAuthService } from "@/services/useAuthLogin";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import liff from "@line/liff";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useLiffLogin = () => {
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  const {
    login: storeUserLogin,
    logout: storeUserLogout,
    setLoading,
  } = useAuthStoreUserLogin();

  const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;

  const { useLogin } = useAuthService();
  const loginMutation = useLogin;

  const initializeLiff = async () => {
    const { userData: storedData } = useAuthStoreUserLogin.getState();
    const hasLocalData = localStorage.getItem("auth-storage");
    const hasLiffToken = Object.keys(localStorage).some(key => key.includes("accessToken"));

    const savedPath = sessionStorage.getItem("last_homeproduct_page");

    if (storedData && hasLocalData && hasLiffToken) {
      if (window.location.pathname === "/") {
        const targetPath = (savedPath && savedPath !== "/") ? savedPath : ROUTE.HOME;
        router.push(targetPath);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      await liff.init({ liffId });

      if (liff.isLoggedIn()) {
        const token = liff.getAccessToken() || "";

        if (!token) {
          liff.login();
          return;
        }

        const userData = await loginMutation.mutateAsync(token);
        await storeUserLogin(userData);

        const currentQuery = window.location.search;
        if (!currentQuery && window.location.pathname === "/") {
          setTimeout(() => {
            const targetPath = (savedPath && savedPath !== "/") ? savedPath : ROUTE.HOME;
            router.push(targetPath);
            router.refresh();
          }, 600);
        }
      } else {
        liff.login({
          redirectUri: `${process.env.NEXT_PUBLIC_LINE_LIFF_REDIRECT_URL}`,
        });
        return false;
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับ Line ได้" as unknown as Error);
      setLoading(false);
      storeUserLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      await initializeLiff();
      if (isMounted) {
        setError(null);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      await storeUserLogout();
      window.location.replace("/");
    }
  };

  return {
    error,
    logout,
  };
};
export default useLiffLogin;
