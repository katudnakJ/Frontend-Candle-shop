import { GetDashboardReportResponse } from "./report.type";

export const mockDashboardReport: GetDashboardReportResponse = {
  monthlySalesSummary: {
    totalSalesThisMonth: 150000,
    percentageChangeTotalSales: 10.5,
    totalSalesTrend: "stable",
  },
  monthlyTotalOrdersSummary: {
    totalOrdersThisMonth: 420,
    percentageChangeTotalOrders: 8.2,
    totalOrdersTrend: "decrease",
    totalTSOrders: 220,
    totalTROrders: 130,
    totalCPOrders: 70,
  },
  monthlyAOVSummary: {
    aovThisMonth: 357.14,
    aovPercentageChange: 4.3,
    aovTrend: "increase",
  },
  monthlyNewCustomersSummary: {
    totalNewCustomersThisMonth: 60,
    newCustomersPercentageChange: 20.0,
    newCustomerTrend: "increase",
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