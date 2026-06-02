/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/app/apiRequest/auth";
import {
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";

// Những page sau sẽ không check refresh token
const UNAUTHORIZED_PATHS = ["/login", "/logout", "/refresh-token", "/register"];

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHORIZED_PATHS.some((p) => pathname.startsWith(p))) {
      return;
    }
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      // Không nên đưa logic lấy access và refresh token ra khỏi cái function checkAndRefreshToken
      // Vì để mỗi lần mà checkAndRefreshToken được gọi thì nó sẽ lấy access và refresh token mới nhất
      // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken || !refreshToken) return;
      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };

      // Thời điểm hết hạn của token là tính theo epoch time (tính bằng giây)
      // Còn khi dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time tính bằng mili giây
      const now = Date.now() / 1000;
      // Trường hợp refresh token hết hạn thì không xử lý nữa
      if (decodedRefreshToken.exp <= now) return;
      // Ví dụ access token có thời gian hết hạn là 10s
      // Thì sẽ kiểm tra còn 1/3 thời gian (3s) thì sẽ cho refresh token lại
      // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
      // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        // Gọi API refresh token để lấy access token mới
        try {
          const res = await authApiRequest.refreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
          clearInterval(interval);
          console.log("Lỗi khi refresh token:", error);
        }
      }
    };
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thờ gian TIMEOUT
    checkAndRefreshToken();
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s sẽ cho check 1 lần
    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [pathname]);
  return null;
}
