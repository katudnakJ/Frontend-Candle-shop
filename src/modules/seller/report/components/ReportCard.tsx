import { TREND } from "@/constants/trend";
import { GetDashboardReportResponse } from "../../report.type";

interface ReportCardProps {
  data : GetDashboardReportResponse; 
  defultColor?: string;
  defultFontColor?: string;
}

export const ReportCard = ({
  data,
  defultColor = "bg-cprojectone",
  defultFontColor = "text-black",
}: ReportCardProps) => {
  return (
    <>
    </>
  );
};
