import http from "@/lib/http";
import {
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

const prefix = "orders";

const orderApiRequest = {
  getOrderList: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrderDetailResType>(
      `/${prefix}?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        }),
    ),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/${prefix}/${orderId}`, body),
  getOrderDetail: (orderId: number) =>
    http.get<GetOrderDetailResType>(`/${prefix}/${orderId}`),
  payOrder: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`/${prefix}/pay`, body),
};

export default orderApiRequest;
