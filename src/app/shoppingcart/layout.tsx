
"use client";

import { RoleGuard } from "@/auth/RoleGuard";
import { USER_ROLE } from "@/constants/userRole";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <RoleGuard allowedRoles={[USER_ROLE.CUSTOMER, USER_ROLE.DEVELOPER]}>
   
      {children}
    </RoleGuard>
  );
}