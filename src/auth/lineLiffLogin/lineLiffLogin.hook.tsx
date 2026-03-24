"use client";

import { ROUTE } from "@/constants/routes";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import liff from "@line/liff";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useLiffLogin = () => {
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  const { login: storeUserLogin, logout: storeUserLogout } = useAuthStoreUserLogin();

  const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;

  const initializeLiff = async () => {
    try {
      await liff.init({ liffId });
      if (liff.isLoggedIn()) {

        const token = liff.getAccessToken() || "";

        

        const currentQuery = window.location.search;
        if (!currentQuery && window.location.pathname === "/") {
          router.push(ROUTE.HOME);
        }

      } else {
        liff.login({
          redirectUri: `${process.env.NEXT_PUBLIC_LINE_LIFF_REDIRECT_URL}`,
        });
        return false;
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับ Line ได้" as unknown as Error);
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
    // login,
    logout,
  };
};
export default useLiffLogin;
