import orderApiRequest from "@/apiRequest/order";
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema";
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

export const useGetOrderList = () => {
  return useQuery({
    queryKey: ["order-list"],
    queryFn: orderApiRequest.getOrderList,
  });
};
