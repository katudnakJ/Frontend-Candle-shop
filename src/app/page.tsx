"use client";

import Image from "next/image";
import Head from "next/head";

import ProductCard from "@/modules/products/components/ProductCard";
import {mockProducts} from "@/modules/products/mockdata"
import Header from "@/components/layout/Customer_Header";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { Customer } from "@/modules/customers/types";
import { User } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api.type";

export default function Home() {
const recommendedItems = mockProducts.filter((item) => item.is_featured == true);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get<void, ApiResponse<Customer>>(
          "/customers/profile",
        );

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white font-sans">
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
        <div className="max-w-7xl mx-auto p-4 space-y-8">
      
      {/* --- ส่วนที่ 1: สินค้าแนะนำ (โชว์แบบแนวนอน) --- */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-black">สินค้าแนะนำ</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {recommendedItems.map((item) => (
            <div key={item.product_id} className="min-w-[180px] w-[180px] md:w-[220px]">
              <ProductCard product={item} isRecommended={true} />
            </div>
          ))}
        </div>
      </section>

      {/* --- ส่วนที่ 2: สินค้าทั้งหมด (Grid 2-4 คอลัมน์) --- */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-black ">สินค้าทั้งหมด</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockProducts.map((item) => (
            <ProductCard key={item.product_id} product={item} />
          ))}
        </div>
      </section>

    </div>

        
      </main>
      <Footer />
    </div>
  );
}
