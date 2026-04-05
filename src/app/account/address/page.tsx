"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AddressForm from "@/modules/account/components/AddressForm";
import { AddressFormSkeleton } from "@/modules/account/components/AddressFormSkeleton";
import { useState, useEffect, Suspense } from "react";
import { useGetAddressDetail } from "@/modules/account/hooks/useAddressesQuery";
import { USER_ROLE } from "@/constants/userRole";
import { RoleGuard } from "@/auth/RoleGuard";
import { useAuthStoreUserLogin } from "@/store/userLogin";

function AddressPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuthStoreUserLogin();
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addressId = searchParams.get("id");
  const { data: addressesData } = useGetAddressDetail(addressId as string);

  return (
    <div>
      <RoleGuard
        allowedRoles={[
          USER_ROLE.SELLER,
          USER_ROLE.ADMIN,
          USER_ROLE.DEVELOPER,
          USER_ROLE.CUSTOMER,
        ]}
      >
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
                  if (
                    userData?.userRole?.toLowerCase() ===
                    USER_ROLE.SELLER.toLowerCase()
                  ) {
                    router.push("/account/sellersetting");
                  } else {
                    router.push("/account/customer");
                  }
                }}
              />
            )}
          </main>
        </div>
      </RoleGuard>
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
