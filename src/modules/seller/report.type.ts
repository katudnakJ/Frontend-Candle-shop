interface ReportTopSellingProductsResp {
  productId: string;
  productName: string;
  totalQuantitySales: number;
}

interface MonthlySalesSummary {
  totalSalesThisMonth: number; // ยอดขายทั้งหมดในเดือนนี้
  percentageChangeTotalSales: number; // อัตราการเปลี่ยนแปลงยอดขายทั้งหมด (%)
  totalSalesTrend: string; // แนวโน้ม ดูจาก percentageChangeOrder
}

interface MonthlyTotalOrdersSummary {
  totalOrdersThisMonth: number; // ยอดออเดอร์ในเดือนนี้
  percentageChangeTotalOrders: number; // อัตราการเปลี่ยนแปลงยอดออเดอร์ (%)
  totalOrdersTrend: string; // แนวโน้ม ดูจาก percentageChangeTotalOrders
  totalTSOrders: number; // ยอดคำสั่งซื้อที่เป็น TS ในเดือนนี้
  totalTROrders: number; // ยอดออเดอร์ที่เป็น TR ในเดือนนี้
  totalCPOrders: number; // ยอดออเดอร์ที่เป็น CP ในเดือนนี้
}

interface MonthlyAOVSummary {
  aovThisMonth: number; // มูลค่าเฉลี่ยต่อคำสั่งซื้อ
  percentageChangeAOV: number; // อัตราการเปลี่ยนแปลงมูลค่าเฉลี่ยต่อคำสั่งซื้อ (%)
  aovTrend: string; // แนวโน้ม ดูจาก percentageChangeAOV
}

interface MonthlyNewCustomersSummary {
 totalNewCustomersThisMonth: number; // จำนวนลูกค้าใหม่ในเดือนนี้ทั้งหมด
  percentageNewCustomersThisMonth: number; // อัตราส่วนลูกค้าใหม่ในเดือนนี้ (%)
  newCustomerTrend: string; //  แนวโน้ม ดูจาก percentageNewCustomersThisMonth
}

export interface GetDashboardReportResponse {
  monthlySalesSummary: MonthlySalesSummary; // สรุปยอดขายรายเดือน
  monthlyTotalOrdersSummary: MonthlyTotalOrdersSummary; // สรุปยอดออเดอร์รายเดือน
  monthlyAOVSummary: MonthlyAOVSummary; // สรุปมูลค่าเฉลี่ยต่อคำสั่งซื้อรายเดือน
  monthlyNewCustomersSummary: MonthlyNewCustomersSummary; // สรุปลูกค้าใหม่รายเดือน
  topSellingProductsThisMonth: ReportTopSellingProductsResp[]; // ยอดขายสินค้าสูงสุดในเดือนนี้
}
