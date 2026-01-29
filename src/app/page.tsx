"use client";

import Image from "next/image";
import Header from "@/components/layout/Customer_Header";
import Footer from "@/components/layout/Footer";
import Head from "next/head";
import { User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white ">
        <section className="py-6 border-b  border-b-blue-600 ml-10 mr-10">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 text-black">
              <User size={60} className="" />
            </div>
            <h1 className="text-2xl md:text-3xl text-black font-sans">
              สวัสดีค่ะคุณ <span className="font-bold">สมรศรี</span>
            </h1>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
