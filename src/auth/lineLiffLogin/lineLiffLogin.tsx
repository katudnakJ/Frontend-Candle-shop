"use client";

import LoadingScreen from "@/components/Loading/LoadingScreen";
import useLiffLogin from "./lineLiffLogin.hook";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import SellerHome from "@/app/SellerHome";
import CustomerHome from "@/app/CustomerHome";
import { USER_ROLE } from "@/constants/userRole";
import { ERROR_MESSAGE } from "@/constants/errorMessage";
const LineLiffLogin = () => {
  const { error } = useLiffLogin();

  
  const {
    isLoading,
    isLoggedIn,
  } = useAuthStoreUserLogin();

  const {
    userData
  } = useAuthStoreUserLogin()

  console.log("auth data : ",userData?.userRole);
  

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : isLoggedIn && (
        userData?.userRole?.toLowerCase() === USER_ROLE.SELLER.toLowerCase() ? (
          <SellerHome />
        ) : 
        userData?.userRole?.toLowerCase() === USER_ROLE.CUSTOMER.toLowerCase() ? (
          <CustomerHome />
        ) : (
         <>
          <div className="text-red-500 text-center">{ERROR_MESSAGE.USER_ROLE_NOT_FOUND}</div>
         </>
        )
      )}

      {error && <div className="text-red-500 text-center">{error.message}</div>}
    </>
  );
};

export default LineLiffLogin;