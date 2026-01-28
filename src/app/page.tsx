import Image from "next/image";
import Header from "@/components/layout/Customer_Header";
import Footer from "@/components/layout/Footer";
import Head from "next/head";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">สวัสดีค่ะคุณ สมรศรี</h1>
        <p>ยินดีต้อนรับสู่ร้านเทียนหอมของเรา...</p>
       
      </main>
      <Footer />
    </div>

    // <div className="background flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    //   <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

    //     <h1 className="font-sans bg-red-500 text-white p-10">Hello Tailwind</h1>
    //     <h2 className="font-sans text-xl font-bold text--"> สวัสดี</h2>
    //   </main>
    // </div>
  );
}
