import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { OAuthSDK } from "nanuid-websdk";
import { getValidToken } from "./auth";

const instance: AxiosInstance = axios.create({
  baseURL: "https://jkvoca-api.ncloud.sbs/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getValidToken();

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
     // OAuthSDK.logout("/");
    }
    return Promise.reject(error);
  }
);

export default instance;