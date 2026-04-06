'use client';
import Footer from "@/components/layout/Footer";
import SellerHeader from "@/components/layout/SellerHeader";
import { ScrollToTop } from "@/utils/ScrollToTop";
import ManualBreadCrumb from "@/modules/seller/report/components/ManualBreadCrumb";
import { ReportCard } from "@/modules/seller/report/components/ReportCard";

export default function SellerReports() {
  
  return (
    <>
          <ScrollToTop threshold={500} />
      <div className="flex flex-col min-h-screen">
        <SellerHeader />
        <main className="grow bg-white font-sans">
          <div className="max-w-1200 mx-auto p-4">
              <ManualBreadCrumb title="รายงานสรุปยอดขายรายเดือน" href="/" />
            < ReportCard />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}