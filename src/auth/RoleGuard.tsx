"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStoreUserLogin } from "@/store/userLogin"; 
import { USER_ROLE } from "@/constants/userRole";
import LoadingScreen from "@/components/Loading/LoadingScreen"; 

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: USER_ROLE[] ;
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const router = useRouter();
  const { userData, isLoggedIn, isLoading } = useAuthStoreUserLogin();


  const hasAccess = isLoggedIn && userData && 
    allowedRoles.map(r => r.toLowerCase()).includes(userData.userRole.toLowerCase());

  useEffect(() => {
    
    if (!isLoading) {
      if (!isLoggedIn || !userData) {
        router.push("/");
      } else if (!hasAccess) {
        
        router.push("/"); 
      }
    }
  }, [isLoading, isLoggedIn, userData, hasAccess, router]);


  if (isLoading || !hasAccess) {
    return <LoadingScreen />;
  }


  return <>{children}</>;
};