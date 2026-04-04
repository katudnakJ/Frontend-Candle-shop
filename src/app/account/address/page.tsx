"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AddressForm from "@/modules/account/components/AddressForm";
import { AddressFormSkeleton } from "@/modules/account/components/AddressFormSkeleton";
import { useState, useEffect, Suspense } from "react";
import { useGetAddressDetail } from "@/modules/account/hooks/useAddressesQuery";

function AddressPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

 
  const addressId = searchParams.get("id");
  const {data : addressesData} = useGetAddressDetail(addressId as string);

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="max-w-[1200px] mx-auto p-6">
        {isLoading ? (
          <AddressFormSkeleton />
        ) : (
          <AddressForm
            key={addressId || "new"} 
            initialData={addressesData ?? undefined}
            onCancel={() => router.back()} 
            onSubmit={() => {
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
