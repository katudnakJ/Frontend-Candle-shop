import { GetDashboardReportResponse } from "@/modules/seller/report.type";

export const mockDashboardReport: GetDashboardReportResponse = {
  monthlySalesSummary: {
    totalSalesThisMonth: 150000,          // ยอดขายเดือนนี้
    percentageChangeTotalSales: 10.5,     // +10.5%
    totalSalesTrend: "up",
  },
  monthlyTotalOrdersSummary: {
    totalOrdersThisMonth: 420,
    percentageChangeTotalOrders: 8.2,     // +8.2%
    totalOrdersTrend: "up",
    totalTSOrders: 220,
    totalTROrders: 130,
    totalCPOrders: 70,
  },
  monthlyAOVSummary: {
    aovThisMonth: 357.14,                 // ค่าเฉลี่ยต่อออเดอร์
    percentageChangeAOV: 4.3,             // +4.3%
    aovTrend: "up",
  },
  monthlyNewCustomersSummary: {
    totalNewCustomersThisMonth: 60,
    percentageNewCustomersThisMonth: 20.0, // 20%
    newCustomerTrend: "up",
  },
  topSellingProductsThisMonth: [
    {
      productId: "P001",
      productName: "Lavender Scented Candle",
      totalQuantitySales: 130,
    },
    {
      productId: "P002",
      productName: "Vanilla Soy Candle",
      totalQuantitySales: 110,
    },
    {
      productId: "P003",
      productName: "Rose Aromatic Candle",
      totalQuantitySales: 95,
    },
  ],
};