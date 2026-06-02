/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import authApiRequest from "@/app/apiRequest/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Xóa đi ký tự "/" đầu tiên của path
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast("Lỗi", {
      description: error?.payload?.message ?? "Lỗi không xác định",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (token: string) => {
  return isBrowser ? localStorage.setItem("accessToken", token) : null;
};

export const setRefreshTokenToLocalStorage = (token: string) => {
  return isBrowser ? localStorage.setItem("refreshToken", token) : null;
};

export const removeTokensFromLocalStorage = () => {
  if (!isBrowser) return null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (params?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
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
  const now = new Date().getTime() / 1000 - 1;
  // Trường hợp refresh token hết hạn thì không xử lý nữa
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return params?.onError?.();
  }
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
      params?.onSuccess?.();
    } catch (error) {
      params?.onError?.();
      console.log("Lỗi khi refresh token:", error);
    }
  }
};
