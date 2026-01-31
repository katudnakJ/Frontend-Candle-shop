"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Customer } from "@/modules/customers/types";
import { getCustomerProfile } from "@/modules/customers/services/CusProfile.service";

export default function CustomerWelcome() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await getCustomerProfile();

        if (res.success) {
          setCustomer(res.data);
        }
      } catch (error) {
        console.log("Local UI handling: stop loading");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <section className="py-6 border-b-2  border-gray-500 ml-10 mr-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
        <div className="p-3 text-black">
          <User size={60} className="" />
        </div>

        <div>
          {loading ? (
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <h1 className="text-2xl md:text-3xl text-black">
              สวัสดีค่ะคุณ{" "}
              <span className="font-bold">
                {customer ? `${customer.Customer_First_Name}` : "ลูกค้า"}
              </span>
            </h1>
          )}
        </div>
      </div>
    </section>
  );
}
