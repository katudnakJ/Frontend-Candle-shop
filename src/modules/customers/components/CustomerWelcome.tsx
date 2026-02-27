"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";

import { Customer } from "@/modules/customers/types";
import { getCustomerProfile } from "@/modules/customers/services/CusProfile.service";
import { useAuthStoreUserLogin } from "@/store/userLogin";

export default function CustomerWelcome() {
  const { userData, isLoading } = useAuthStoreUserLogin();
  // const [customer, setCustomer] = useState<Customer | null>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       setLoading(true);

  //       const res = await getCustomerProfile();

  //       if (res.success) {
  //         setCustomer(res.data);
  //       }
  //     } catch (error) {
  //       console.log("Local UI handling: stop loading");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, []);
console.log("displayName: "+userData?.displayName)
  return (
    <div className="bg-cprojectone border border-cprojectone">
    <section className="max-w-[1200px] m-10 xl:mx-auto py-6 px-4 md:px-10 bg-white rounded-2xl drop-shadow-md ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
        <div className="p-3 text-black">
          <User size={60} className="" />
        </div>

        <div>
          {isLoading ? (
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <h1 className="text-2xl md:text-3xl text-black">
              สวัสดีค่ะคุณ{" "}
              <span className="font-bold">
                {userData?.displayName ?  userData.displayName : "ลูกค้า"}
              </span>
            </h1>
          )}
        </div>
      </div>
    </section>
    </div>
  );
}
