import http from "@/lib/http";
import {
  GetOrderDetailResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";

const prefix = "/orders";

const orderApiRequest = {
  getOrderList: () => http.get<GetOrderDetailResType>(`${prefix}`),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body),
};

export default orderApiRequest;
