import orderApiRequest from "@/apiRequest/order";
import {
  GetOrdersQueryParamsType,
  PayGuestOrdersBodyType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & { orderId: number }) =>
      orderApiRequest.updateOrder(orderId, body),
  });
};

export const useGetOrderList = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ["orders-list", queryParams],
    queryFn: () => orderApiRequest.getOrderList(queryParams),
  });
};

export const useGetOrderDetail = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["orders-detail", id],
    queryFn: () => orderApiRequest.getOrderDetail(id),
    enabled,
  });
};

export const usePayOrderForGuestMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) =>
      orderApiRequest.payOrder(body),
  });
};
