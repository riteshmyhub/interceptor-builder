import type { AxiosInstance, AxiosInterceptorManager, AxiosResponse, InternalAxiosRequestConfig } from "axios";

type Req = AxiosInterceptorManager<InternalAxiosRequestConfig<any>>;
type Res = AxiosInterceptorManager<AxiosResponse<any, any>>;

interface Interceptor {
   instance: AxiosInstance;
   intercept(request: Req, response: Res): AxiosInstance;
}

export type { Interceptor, Req, Res };
