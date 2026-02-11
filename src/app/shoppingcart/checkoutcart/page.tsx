import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4 space-y-6">
          <section>
            <h2 className="font-black text-xl mb-3 uppercase ">
              Delivery Address
            </h2>
            {/* <AddressCard /> - เอา Component ที่คุณเคยทำมาลงตรงนี้ */}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
