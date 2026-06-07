import indicatorApiRequest from "@/apiRequest/indicator";
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardIndicator = (
  queryParams: DashboardIndicatorQueryParamsType,
) => {
  return useQuery({
    queryKey: ["dashboard-indicators", queryParams],
    queryFn: () => indicatorApiRequest.getDashboardIndicators(queryParams),
  });
};
