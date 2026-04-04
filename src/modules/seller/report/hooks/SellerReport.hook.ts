import { useGetDashboardReportsData } from "../service/GetDashboardReportsData";
import { GetExcelReport } from "../service/GetExcelReport";

type UseSellerReportParams = {
  month: number;
  year: number;
}

export const useSellerReport = ({ month, year }: UseSellerReportParams) => {

  const { data , isLoading, refetch } = useGetDashboardReportsData({ month, year });
  const { mutate: exportExcel, isPending } = GetExcelReport({ month, year, format: "excel" });

  const handleExportExcel = () => {
    exportExcel();
  }

    return {
      data,
      isLoading,
      isPending,
      refetch,
      handleExportExcel
    }
}