import indicatorApiRequest from "@/src/apiRequest/indicator";
import { DashboardIndicatorQueryParamsType } from "@/src/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardIndicator = (
  queryParams: DashboardIndicatorQueryParamsType,
) => {
  return useQuery({
    queryKey: ["dashboard-indicators", queryParams],
    queryFn: () => indicatorApiRequest.getDashboardIndicators(queryParams),
  });
};
