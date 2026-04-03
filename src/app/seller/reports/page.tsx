'use client';
import Footer from "@/components/layout/Footer";
import SellerHeader from "@/components/layout/SellerHeader";
import { ScrollToTop } from "@/utils/ScrollToTop";
import { mockDashboardReport } from "../mockDashboardReportsData";
import ManualBreadCrumb from "@/modules/seller/report/components/ManualBreadCrumb";
import { ReportCard } from "@/modules/seller/report/components/ReportCard";
// import { useGetDashboardReportsData } from "@/modules/seller/report/service/GetDashboardReportsData";

export default function SellerReports() {
  
const data = mockDashboardReport; // ใช้ข้อมูลจำลองจาก mockDashboardReportsData.ts
  
  // const {data: reportData, isLoading, error} = useGetDashboardReportsData({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  // console.log("reportData : ", reportData);
  
  return (
    <>
          <ScrollToTop threshold={500} />
      <div className="flex flex-col min-h-screen">
        <SellerHeader />
        <main className="grow bg-white font-sans">
          <div className="max-w-1200 mx-auto p-4">
            <ManualBreadCrumb title="รายงานยอดขาย" href="/" />
            
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}