import { useState, useSyncExternalStore } from "react";
import { TopProduct } from "../report.type";
import { StatCard } from "./ReportStatCard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { OrderTypeCard, ReportCardSkeleton, ProductBarChart } from "./index";
import { Button } from "@headlessui/react";
import { useSellerReport } from "../hooks/SellerReport.hook";

dayjs.extend(utc);
dayjs.extend(buddhistEra);
dayjs.extend(timezone);
dayjs.locale("th");

interface ReportCardProps {
  defultFontColor?: string;
}

export const ReportCard = ({
  defultFontColor = "text-black",
}: ReportCardProps) => {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const now = dayjs().tz("Asia/Bangkok");
  const [month, setMonth] = useState<number>(() => now.month() + 1);
  const [year, setYear] = useState<number>(() => now.year());

  const { data, isLoading, isPending, handleExportExcel } = useSellerReport({
    month,
    year,
  });

  const hasData = data && data.monthlySalesSummary?.totalSalesThisMonth > 0;

  const topProducts: TopProduct[] =
    data?.topSellingProductsThisMonth?.map((p) => ({
      name: p.productName,
      value: p.totalQuantitySales,
    })) ?? [];

  const formatPercent = (num?: number) => {
    if (num == null || isNaN(num)) return "-";
    return `${num.toFixed(1)}% จากเดือนที่แล้ว`;
  };

  return (
    <>
      {isLoading ? (
        <ReportCardSkeleton />
      ) : (
        <div
          className={`mx-auto min-h-[60vh] max-w-215 bg-[#ffffff] px-4 pb-12 pt-8 sm:px-6 text-lg md:text-base lg:text-lg ${defultFontColor}`}
        >
          <h1 className="mb-6 flex items-center gap-2 font-prompt text-2xl md:text-[clamp(1.1rem,2.5vw,1.35rem)] font-medium text-[#1a1714] tracking-[-0.01em]">
            <span className="block h-[1.3em] w-1 rounded bg-[#c9a96e]" />
            Report สรุปยอดขายของสินค้า
          </h1>

          <div className="mb-7 flex flex-wrap gap-2.5">
            {isClient ? (
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="th"
              >
                <DatePicker
                  label="เดือน"
                  views={["month"]}
                  format="MMMM"
                  value={
                    year && month
                      ? dayjs()
                          .year(year)
                          .month(month - 1)
                      : null
                  }
                  onChange={(value) => value && setMonth(value.month() + 1)}
                  disableFuture
                />
                <DatePicker
                  label="ปี (ค.ศ.)"
                  views={["year"]}
                  value={year ? dayjs().year(year) : null}
                  onChange={(value) => value && setYear(value.year())}
                  slotProps={{
                    textField: { onKeyDown: (e) => e.preventDefault() },
                  }}
                  disableFuture
                />
              </LocalizationProvider>
            ) : (
              <div className="flex gap-2.5">
                <div className="h-14 w-32 animate-pulse rounded bg-gray-100" />
                <div className="h-14 w-32 animate-pulse rounded bg-gray-100" />
              </div>
            )}
          </div>

          {!hasData ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e8e2d9] bg-[#fcfbf9] py-20 text-center">
              <svg
                className="mb-4 h-12 w-12 text-[#a09890]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl font-medium text-[#6b6460]">
                ไม่พบข้อมูลยอดขายในเดือนนี้
              </p>
              <p className="text-[#a09890]">
                กรุณาเลือกช่วงเวลาอื่นที่ต้องการดูรายงาน
              </p>
            </div>
          ) : (
            <>
              <p className="mb-3 mt-7 text-2xl font-semibold uppercase tracking-[0.08em] text-[#a09890]">
                ภาพรวมยอดขาย
              </p>
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <StatCard
                  label="ยอดขายทั้งหมด"
                  value={`฿ ${(data?.monthlySalesSummary?.totalSalesThisMonth ?? 0).toLocaleString("th-TH")}`}
                  trend={{
                    percentage: formatPercent(
                      data?.monthlySalesSummary?.percentageChangeTotalSales,
                    ),
                    trendDirection: data?.monthlySalesSummary?.totalSalesTrend,
                  }}
                />
                <StatCard
                  label="คำสั่งซื้อทั้งหมด"
                  value={
                    data?.monthlyTotalOrdersSummary?.totalOrdersThisMonth ?? 0
                  }
                  badge="คำสั่งซื้อ"
                  trend={{
                    percentage: formatPercent(
                      data?.monthlyTotalOrdersSummary
                        ?.percentageChangeTotalOrders,
                    ),
                    trendDirection:
                      data?.monthlyTotalOrdersSummary?.totalOrdersTrend,
                  }}
                />
              </div>

              <div className="mb-4 grid grid-cols-3 gap-3">
                <OrderTypeCard
                  label="TSOrders"
                  value={data?.monthlyTotalOrdersSummary?.totalTSOrders ?? 0}
                />
                <OrderTypeCard
                  label="TROrders"
                  value={data?.monthlyTotalOrdersSummary?.totalTROrders ?? 0}
                />
                <OrderTypeCard
                  label="CPOrders"
                  value={data?.monthlyTotalOrdersSummary?.totalCPOrders ?? 0}
                />
              </div>

              <div className="mb-7 grid gap-3 sm:grid-cols-2">
                <StatCard
                  label="มูลค่าเฉลี่ยต่อคำสั่งซื้อ"
                  value={`฿ ${(data?.monthlyAOVSummary?.aovThisMonth ?? 0).toLocaleString("th-TH")}`}
                  trend={{
                    percentage: formatPercent(
                      data?.monthlyAOVSummary?.aovPercentageChange,
                    ),
                    trendDirection: data?.monthlyAOVSummary?.aovTrend,
                  }}
                />
                <StatCard
                  label="ลูกค้าใหม่"
                  value={`${data?.monthlyNewCustomersSummary?.totalNewCustomersThisMonth ?? 0} คน`}
                  trend={{
                    percentage: formatPercent(
                      data?.monthlyNewCustomersSummary
                        ?.newCustomersPercentageChange,
                    ),
                    trendDirection:
                      data?.monthlyNewCustomersSummary?.newCustomerTrend,
                  }}
                />
              </div>

              <p className="mb-3 text-2xl font-semibold uppercase tracking-[0.08em] text-[#a09890]">
                สินค้าขายดี
              </p>
              <div className="mb-7 rounded-xl border border-[#e8e2d9] bg-white p-5 text-2xl shadow-sm">
                <p className="mb-4 font-prompt text-xl font-medium text-[#6b6460] md:text-2xl">
                  5 อันดับสินค้าที่มียอดขายมากที่สุด
                </p>
                <ProductBarChart data={topProducts} />
              </div>

              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#e8e2d9] bg-[#f5f2ee] px-6 py-5 text-center">
                <p className="text-2xl leading-relaxed text-[#a09890]">
                  ดาวน์โหลดสรุปรายการสินค้าทั้งหมดประจำเดือน
                </p>
                <Button
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-[#e8e2d9] bg-white px-5 text-base font-semibold text-[#1a1714] shadow-sm transition hover:border-[#c9a96e] hover:bg-[#f0e8d8] active:scale-[0.97] md:text-[0.88rem]"
                  onClick={() => handleExportExcel()}
                  disabled={isPending}
                >
                  <svg
                    className="h-4 w-4 text-[#5a8a6a]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {isPending ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด Excel"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
