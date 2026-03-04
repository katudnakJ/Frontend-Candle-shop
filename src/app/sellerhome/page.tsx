import SellerHeader from "@/components/layout/SellerHeader";
import Footer from "@/components/layout/Footer";
import { ClipboardList, LayoutGrid, BarChart3 } from "lucide-react";
import SellerrWelcome from "@/modules/seller/components/SellerWelcome";
import Link from "next/link";

export default function sellerHome() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header*/}
      <SellerHeader />

      <main className="flex-grow bg-white font-sans">
        {/* Welcome seller*/}

        <div className="bg-white">
          <section>
            <SellerrWelcome mode="welcome" />
          </section>
        </div>

        <div className="bg-white w-full min-h-screen">
          <div className="max-w-[1200px] mx-auto p-4 space-y-8 bg-white ">
            <section className="flex flex-col gap-20 py-4">
              <section>
                <Link
                  href="/seller/orders"
                  className="flex items-center justify-center gap-4 bg-[#FDF8F1] border border-black rounded-2xl p-8 
             hover:bg-yellow-50 hover:-translate-y-1 hover:shadow-xl 
             transition-all duration-300 shadow-sm group active:scale-95"
                >
               
                  <ClipboardList
                    size={32}
                    className="text-black group-hover:animate-pulse"
                  />
                  <span className="text-2xl font-medium text-black">
                    จัดการคำสั่งซื้อ
                  </span>
                </Link>
              </section>

              <section>
            <Link
                  href="/seller/products"
                  className="flex items-center justify-center gap-4 bg-[#FDF8F1] border border-black rounded-2xl p-8 
             hover:bg-yellow-50 hover:-translate-y-1 hover:shadow-xl 
             transition-all duration-300 shadow-sm group active:scale-95"
                >
               
                  <LayoutGrid
                    size={32}
                    className="text-black group-hover:animate-pulse"
                  />
                  <span className="text-2xl font-medium text-black">
                    จัดการสินค้า
                  </span>
                </Link>
              </section>

    
              <section>
           <Link
                  href="/seller/reports"
                  className="flex items-center justify-center gap-4 bg-[#FDF8F1] border border-black rounded-2xl p-8 
             hover:bg-yellow-50 hover:-translate-y-1 hover:shadow-xl 
             transition-all duration-300 shadow-sm group active:scale-95"
                >
               
                  <BarChart3
                    size={32}
                    className="text-black group-hover:animate-pulse"
                  />
                  <span className="text-2xl font-medium text-black">
                      Report / สรุปยอดขายสินค้า
                  </span>
                </Link>
              </section>
            </section>
          </div>
        </div>
      </main>
      {/* Footer*/}

      <Footer />
    </div>
  );
}
