
import ProductCardformock from "@/modules/products/components/ProductCardformock";
import { mockProducts } from "@/modules/products/mockdata";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import { ListFilter } from "lucide-react";
import CustomerWelcome from "@/modules/customers/components/CustomerWelcome";

export default function Home() {
  {
    /* ตรวจสอบว่าเป็นสินค้าแนะนำไหม*/
  }
  const recommendedItems = mockProducts.filter(
    (item) => item.is_featured == true,
  );

  {
    /* ตรวจสอบว่ามีสินค้าทั้งหมดกี่อย่าง*/
  }
  const totalItem = mockProducts.length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header*/}
      <Header />

      <main className="flex-grow bg-white font-sans">
        {/* Welcome Customer*/}

        <div className="bg-cprojectone">
          <section >
            <CustomerWelcome />
          </section>
        </div>

        <div className="bg-cprojectone w-full min-h-screen">
          <div className="max-w-[1200px] mx-auto p-4 space-y-8 bg-white ">
            {/* สินค้าแนะนำ      */}

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">
                สินค้าแนะนำ
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                {recommendedItems.map((item) => (
                  <div
                    key={item.product_id}
                    className="min-w-[180px] w-[180px] md:w-[200px] lg:w-[400px]"
                  >
                    <ProductCardformock product={item} isRecommended={true} />
                  </div>
                ))}
              </div>
            </section>

            {/* สินค้าทั้งหมด      */}

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black ">
                สินค้าทั้งหมด
              </h2>
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-400 ">
                  จำนวนทั้งหมด {totalItem} ชิ้น
                </p>
                <button
                  className=" p-2 border bg-cprojectone border-black rounded-xl 
              cursor-pointer 
              hover:translate-y-1 
              transition-all duration-300
              "
                >
                  <ListFilter size={14} className="text-black" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockProducts.map((item) => (
                  <ProductCardformock key={item.product_id} product={item} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      {/* Footer*/}

      <Footer />
    </div>
  );
}