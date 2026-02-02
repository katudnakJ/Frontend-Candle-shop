"use client"

import useLiffLogin from "./lineLiffLogin.hook";
import LoadingScreen from "@/app/LoadingScreen";

const lineLiffLogin = () => {
   
    const {
        lineProfile,
        isLoading,
        error,
    } = useLiffLogin();
      
    if(isLoading){
        return <LoadingScreen />;
    }else {
        return (
        <>
     <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <img src={lineProfile?.pictureUrl} alt="LIFF Logo" className="mx-auto mb-6 w-32 h-32" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hello คุณ {lineProfile?.displayName}
        </h1>
        <p className="text-lg text-gray-600">
          Line id : {lineProfile?.userId}
        </p>
        <p className="text-lg text-gray-600">
            lineToken : {"lineToken"}
        </p>
      </div>
    </div>
        </>
    );
    }
    
};

export default lineLiffLogin;