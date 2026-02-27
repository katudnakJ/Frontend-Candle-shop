import Head from "next/head";

import ProductCard from "@/modules/products/components/ProductCard";
import { mockProducts } from "@/modules/products/mockdata";
import Header from "@/components/layout/CustomerHeader";

import SellerHeader from "@/components/layout/SellerHeader";
import Footer from "@/components/layout/Footer";
import { ListFilter } from "lucide-react";
import SellerrWelcome from "@/modules/seller/components/SellerWelcome";

export default function sellerHome() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header*/}
      <SellerHeader />

      <main className="flex-grow bg-white font-sans">
        {/* Welcome seller*/}
        <SellerrWelcome />
        <div className="bg-white">
          <section></section>
        </div>

        <div className="bg-white w-full min-h-screen">
          <div className="max-w-[1200px] mx-auto p-4 space-y-8 bg-white ">
            {/* สินค้าแนะนำ      */}

            <section></section>

            {/* สินค้าทั้งหมด      */}

            <section></section>

            <section></section>
          </div>
        </div>
      </main>
      {/* Footer*/}

      <Footer />
    </div>
  );
}
