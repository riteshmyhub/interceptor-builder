import type { AxiosInstance, AxiosInterceptorManager, AxiosResponse, InternalAxiosRequestConfig } from "axios";

type Req = AxiosInterceptorManager<InternalAxiosRequestConfig<any>>;
type Res = AxiosInterceptorManager<AxiosResponse<any, any>>;
type Instance = AxiosInstance;
interface Interceptor {
   instance: Instance;
   intercept(req: Req, res: Res): Instance;
}

export type { Interceptor, Req, Res, Instance };
