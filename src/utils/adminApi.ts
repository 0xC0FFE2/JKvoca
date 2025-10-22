import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import AuthService from "../services/AuthService";

const instance: AxiosInstance = axios.create({
  baseURL: "https://jkvoca-api.ncloud.sbs/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    // 새로운 로그인 시스템의 토큰 사용
    const token = AuthService.getAccessToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // 401 에러 시 로그아웃 처리
      AuthService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
