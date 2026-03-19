"use client";

import LoadingScreen from "@/components/Loading/LoadingScreen";
import useLiffLogin from "./lineLiffLogin.hook";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import { useEffect } from "react"; 
import { useRouter, } from "next/navigation"; 

const LineLiffLogin = () => {
  const { error, logout } = useLiffLogin();
  const router = useRouter();

  
  const {
    isLoading,
    isLoggedIn,
    userData,
  } = useAuthStoreUserLogin();


  useEffect(() => {
    if (isLoggedIn && !isLoading) {
    
        
        router.push("/customerhome");
      }
  }, [isLoggedIn, isLoading, router]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : isLoggedIn && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <button
            onClick={logout}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hello คุณ {userData?.displayName}!
            </h1>
            <p className="text-lg text-gray-600">
               กำลังพากลับไปยังหน้าเดิม...
            </p>
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-center">{error.message}</div>}
    </>
  );
};

export default LineLiffLogin;