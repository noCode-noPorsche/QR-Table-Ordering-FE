import http from "@/src/lib/http";
import {
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/src/schemaValidations/auth.schema";
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/src/schemaValidations/guest.schema";

const prefix = "guest";

const guestApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>(`/${prefix}/auth/login`, body),
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>(`/api/${prefix}/auth/login`, body, {
      baseURL: "",
    }),
  sLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post(
      `/auth/${prefix}/logout`,
      { refreshToken: body.refreshToken },
      {
        headers: { Authorization: `Bearer ${body.accessToken}` },
      },
    ),
  logout: () => http.post(`/api/${prefix}/auth/logout`, null, { baseURL: "" }),
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>(`/${prefix}/auth/refresh-token`, body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      `/api/${prefix}/auth/refresh-token`,
      null,
      {
        baseURL: "",
      },
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
  createOrder: (body: GuestCreateOrdersBodyType) =>
    http.post<GuestCreateOrdersResType>(`/${prefix}/orders`, body),
  getOrderList: () => http.get<GuestGetOrdersResType>(`/${prefix}/orders`),
};

export default guestApiRequest;
