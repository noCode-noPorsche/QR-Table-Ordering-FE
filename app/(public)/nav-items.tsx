"use client";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    // ✨ Đưa vào setTimeout để chuyển thành bất đồng bộ
    setTimeout(() => {
      setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
    }, 0);
  }, []);

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
