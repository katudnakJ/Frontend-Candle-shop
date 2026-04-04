'use client';

import { GenericResponse } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { GetDashboardReportResponse } from "../report.type";

interface GetDashboardReportsDataParams {
    month: number;
    year: number;
}
export const useGetDashboardReportsData = ({ month, year }: GetDashboardReportsDataParams) => {
    return useQuery({
        queryKey: ["getDashboardReportsData", month, year],
        queryFn: async () => {
            const response = await apiClient.get<void, GenericResponse<GetDashboardReportResponse>>(
                "/v1/reports/dashboard",
                {
                    params: { month, year }
                }
            );
            return response.data ?? null;
        },
        staleTime: 15 * 60 * 1000,
        retry: 0,
    });
}