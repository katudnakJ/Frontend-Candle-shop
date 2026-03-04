"use client";

import { mockAddresses } from "@/modules/account/mockaddress";
import { useSearchParams, useRouter } from "next/navigation";
import AddressForm from "@/modules/account/components/AddressForm";
import { AddressFormSkeleton } from "@/modules/account/components/AddressFormSkeleton";
import { useState, useEffect, Suspense } from "react";

function AddressPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

 
  const addressId = searchParams.get("id");

  // (ในอนาคตคือ Fetch จาก API)
  const editingAddress = mockAddresses.find(
    (addr) => addr.address_id === addressId,
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="max-w-[1200px] mx-auto p-6">
        {isLoading ? (
          <AddressFormSkeleton />
        ) : (
          <AddressForm
            key={addressId || "new"} 
            initialData={editingAddress}
            onCancel={() => router.back()} 
            onSubmit={(data) => {
              console.log("บันทึก:", data);
              router.push("/account/customer"); 
            }}
          />
        )}
      </main>
    </div>
  );
}

export default function AddressPage() {
  return (
    <Suspense fallback={<AddressFormSkeleton />}>
      <AddressPageContent />
    </Suspense>
  );
}
