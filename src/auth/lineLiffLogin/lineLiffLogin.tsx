"use client";

import LoadingScreen from "@/components/Loading/LoadingScreen";
import useLiffLogin from "./lineLiffLogin.hook";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import { ERROR_MESSAGE } from "@/constants/errorMessage";
import { ErrorPage } from "@/components/Error/ErrorDisplay";
import { USER_ROLE } from "@/constants/userRole";
import CustomerHome from "@/app/CustomerHome";
import SellerHome from "@/app/SellerHome";

const LineLiffLogin = () => {
  const { error, logout } = useLiffLogin();

  
  const {
    isLoading,
    isLoggedIn,
    userData
  } = useAuthStoreUserLogin();  

     if (process.env.NODE_ENV === "development") {

        console.log("USERDATA IS : ",userData)      
     }

return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : isLoggedIn && (
        <>
          {userData?.userRole?.toLowerCase() === USER_ROLE.CUSTOMER.toLowerCase() ? 
            (
              <CustomerHome />
            ) : userData?.userRole?.toLowerCase() === USER_ROLE.SELLER.toLowerCase() ? ( 
              <SellerHome />

            ) : userData?.userRole?.toLowerCase() === USER_ROLE.ADMIN.toLowerCase() ? (
              <SellerHome /> // for workaround admin login to access seller dashboard

            ) : (
              <ErrorPage 
                message={ERROR_MESSAGE.USER_ROLE_NOT_FOUND}
                onRetry={() => {
                  logout();
                }}
              />
            )
          }
        </>
      )
      }

      {error && <div className="text-red-500 text-center">{error.message}</div>}
    </>
  );
};

export default LineLiffLogin;