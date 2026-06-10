"use client";

import { useAppStore } from "@/components/app-provider";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderList } from "@/queries/useGuest";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderList();
  const orders = data?.payload.data ?? [];
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  const socket = useAppStore((state) => state.socket);

  const { waitingForPaying, paid } = orders.reduce(
    (result, order) => {
      if (
        order.status === OrderStatus.Pending ||
        order.status === OrderStatus.Delivered ||
        order.status === OrderStatus.Processing
      ) {
        return {
          ...result,
          waitingForPaying: {
            price:
              result.waitingForPaying.price +
              order.dishSnapshot.price * order.quantity,
            quantity: result.waitingForPaying.quantity + order.quantity,
          },
        };
      }

      if (order.status === OrderStatus.Paid) {
        return {
          ...result,
          paid: {
            price:
              result.paid.price + order.dishSnapshot.price * order.quantity,
            quantity: result.paid.quantity + order.quantity,
          },
        };
      }

      return result;
    },
    {
      waitingForPaying: {
        quantity: 0,
        price: 0,
      },
      paid: {
        quantity: 0,
        price: 0,
      },
    },
  );

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("onConnect", socket?.id);
    }

    function onDisconnect() {
      console.log("onDisconnect", socket?.id);
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      console.log(data);
      const {
        dishSnapshot: { name },
        status,
        quantity,
      } = data;
      toast(
        `Món ăn ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái ${getVietnameseOrderStatus(status)}`,
      );
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast(
        `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`,
      );
      refetch();
    }

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("update-order", onUpdateOrder);
    socket?.on("payment", onPayment);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("update-order", onUpdateOrder);
      socket?.off("payment", onPayment);
    };
  }, [refetch, socket, disconnectSocket]);

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm font-semibold">{index + 1}</div>
          <div className="-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-20 h-20 rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <p className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x{" "}
              <Badge className="px-1.5 py-1.5">{order.quantity}</Badge>
            </p>
          </div>
          <div className="shrink-0 ml-auto flex justify-center items-center">
            <Badge variant="secondary">
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      {paid.quantity !== 0 && (
        <div className="sticky bottom-0 flex">
          <div className="w-full flex space-x-4 justify-between text-xl font-semibold">
            <span>Đơn đã thanh toán: {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 flex">
        <div className="w-full flex space-x-4 justify-between text-xl font-semibold">
          <span>Đơn chưa thanh toán: {waitingForPaying.quantity} món</span>
          <span>{formatCurrency(waitingForPaying.price)}</span>
        </div>
      </div>
    </>
  );
}
