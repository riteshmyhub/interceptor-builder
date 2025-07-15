import type { AxiosInstance } from "axios";
import { Interceptor } from "../types/type";

export class InterceptorBuilder {
   private instance: AxiosInstance;

   constructor(instance: AxiosInstance) {
      this.instance = instance;
   }

   use(interceptor: new (instance: AxiosInstance) => Interceptor): this {
      const interceptorInstance = new interceptor(this.instance);
      interceptorInstance.intercept(
         this.instance.interceptors.request, //
         this.instance.interceptors.response
      );
      return this;
   }

   build(): AxiosInstance {
      return this.instance;
   }
}
