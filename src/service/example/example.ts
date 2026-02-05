

// interface GetReportList {
//   storeId?: string;
//   pointTransDate?: string;
//   storeName?: string;
//   earn?: number;
//   burnt?: number;
//   startDate?: string;
//   endDate?: string;
//   status?: string;
//   page?: number;
//   size?: number;
// }



// export const useGetReportList = ({
//   startDate,
//   endDate,
//   page,
//   size,
// }: GetReportList) => {
//   const params: GetReportList = {
//     page: page,
//     size: size,
//   };

//   if (startDate) params.startDate = startDate;
//   if (endDate) params.endDate = endDate;

//   return useQuery({
//     queryKey: [
//       "search-paging",
//       startDate,
//       endDate,
//     ],
//     queryFn: (): Promise<ReportResponse> =>
//       apiClient.get(`/report/list/point_of_store`, {
//         params
//       }),
//     retry: 0,
//     enabled : Boolean(startDate) && Boolean(endDate),
//   });
// };
