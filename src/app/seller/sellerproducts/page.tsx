"use client";

import SellerHeader from "@/components/layout/SellerHeader";
import Footer from "@/components/layout/Footer";
import { ProductHeader } from "@/modules/products/components/ProductHeader";
import ShopProductList from "@/modules/products/components/ShopProductList";
import { useShopProductStore } from "@/modules/products/hooks/useShopProductStore";
import { useShopProducts } from "@/modules/products/hooks/useShopProducts";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default function SellerProducts() {
  const { searchQuery, setSearchQuery } = useShopProductStore();
  const { totalAll, isLoading } = useShopProducts();


  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <SellerHeader />
      <main className="grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4">
          <ProductHeader mode="sellerproducs" namemode="จัดการสินค้า" />

          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="หมายเลขสินค้า หรือ ชื่อสินค้า"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none font-prompt"
            />
          </div>
          <div className="max-w-2xl md:max-w-7xl px-4 mt-6">
            <div className="flex justify-between items-center">
              {isLoading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-5"></div>
              ) : (
                <>
                  <h1 className="text-[12px] md:text-[16px] font-black font-prompt">
                    จำนวนสินค้า {totalAll} รายการ
                  </h1>
                  <Link href="/seller/sellerproducts/addproducts">
                    <button className="flex items-center gap-2">
                      <span className="text-[12px] md:text-[16px]">
                        เพิ่มสินค้า
                      </span>
                      <div
                        className="bg-cprojectone text-black border-2 border-black w-10 h-10 md:w-12 md:h-12 
                  flex items-center justify-center
                  rounded-xl 
                  group-active:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px] 
                  transition-all cursor-pointer"
                      >
                        <Plus size={24} strokeWidth={3} />
                      </div>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <ShopProductList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
