import { appConfig } from "@/config/appConfig";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface GetExcelReportParams {
  month: number;
  year: number;
  format: string;
}

export const GetExcelReport = ({
  month,
  year,
  format,
}: GetExcelReportParams) => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "v1/reports",
        {},
        {
          params: { month, year, format },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          baseURL: appConfig.localApiEndpointUrl,
          withCredentials: true,
        },
      );
      return response;
    },
    onSuccess: async (response) => {
      const contentType = response.headers?.["content-type"] || "";

      if (contentType.includes("application/json")) {
        const text = await response.data.text();
        const error = JSON.parse(text);

        toast.error(error.message || "เกิดข้อผิดพลาด");
        return;
      }

      const blob = new Blob([response.data], {
        type: contentType || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `Sales_Report_${month}_${year}.xlsx`);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("ดาวน์โหลดรายงานสำเร็จ!");
    },
    onError: () => {
      const message = "เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์";
      toast.error(message);
    },
  });
};
