"use client";

import Image from "next/image";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import useLiffLogin from "./lineLiffLogin.hook";
import { useAuthStoreUserLogin } from "@/store/userLogin";

const LineLiffLogin = () => {
  const { error, logout } = useLiffLogin();
  const {
    isLoading,
    isLoggedIn,
    userData,
  } = useAuthStoreUserLogin();

  return (
    <>
      {isLoading ? 
      (
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
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LineLiffLogin;
