"use client";
import { useAppContext } from "@/components/app-provider";
import Link from "next/link";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // authRequired: undefined nghĩa là đăng nhập hay chưa vẫn hiển thị
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true, // Chỉ hiển thị khi đã đăng nhập
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // Chỉ hiển thị khi chưa đăng nhập
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // Chỉ hiển thị khi đã đăng nhập
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();

  return menuItems.map((item) => {
    if (
      (item.authRequired === true && !isAuth) ||
      (item.authRequired === false && isAuth)
    ) {
      return null; // Nếu cần đăng nhập mà chưa có token, hoặc không cần đăng nhập mà đã có token, không hiển thị
    }
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
