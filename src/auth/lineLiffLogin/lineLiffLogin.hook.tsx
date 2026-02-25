"use client";

import { ROUTE } from "@/constants/routes";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import liff from "@line/liff";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useLiffLogin = () => {
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  const { login: storeUserLogin, logout: storeUserLogout } =
    useAuthStoreUserLogin();

   const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;

  const initializeLiff = async () => {
    try {
      await liff.init({ liffId });
      if (liff.isLoggedIn()) {
        const token = liff.getAccessToken() || "";
        storeUserLogin(token);
<<<<<<< HEAD
        console.log("token :", token);
        
=======
        console.log(token);

>>>>>>> d3f28b3d75a396a83d81f7bbc4b37205b4ca93d1
        router.push(ROUTE.HOME);
      } else {
        liff.login({
          redirectUri: `${process.env.NEXT_PUBLIC_LINE_LIFF_REDIRECT_URL}`,
        });
        router.push(ROUTE.HOME); //อาจมีการbug เรื่องทับซ้อนกัน Redirect
        return false;
      }
    } catch (err) {
      console.log("LIFF initialization failed : ", err);
      setError("ไม่สามารถเชื่อมต่อกับ Line ได้" as unknown as Error);
    }
  };

  useEffect(() => {
    (async () => {
      await initializeLiff();
    })();
  }, []);

  // const login = () => {
  //     if (!liff.isLoggedIn()) {
  //         liff.login();
  //     }
  // }

  const logout = async () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      storeUserLogout();
      router.refresh();
    }
  };

  return {
    error,
    // login,
    logout,
  };
};
export default useLiffLogin;
