"use client";

import { Badge } from "@/components/ui/badge";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderList } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderList();
  const orders = data?.payload.data ?? [];

  const totalPrice = orders.reduce((result, order) => {
    return result + order.dishSnapshot.price * order.quantity;
  }, 0);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("onConnect", socket.id);
    }

    function onDisconnect() {
      console.log("onDisconnect", socket.id);
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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("onUpdateOrder", onUpdateOrder);
    };
  }, [refetch]);

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
      <div className="sticky bottom-0 flex">
        <div className="w-full flex space-x-4 justify-between text-xl font-semibold">
          <span>Tổng cộng: {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  );
}
