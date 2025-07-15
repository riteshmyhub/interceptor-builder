# Interceptor Builder

A clean and extendable interceptor builder for chaining and organizing multiple request/response interceptors.

## 📦 Installation

```bash
npm install interceptor-builder
```

## 🚀 Getting Started

#### #1. Create Custom Interceptors

```typescript
import type { Interceptor, Req, Res, Instance } from "interceptor-builder";

export default class MyInterceptor implements Interceptor {
   public instance: Instance;

   constructor(instance: Instance) {
      this.instance = instance;
   }

   intercept(req: Req, res: Res): Instance {
      req.use(
         (config) => config,
         (error) => Promise.reject(error)
      );

      res.use(
         (response) => response,
         (error) => Promise.reject(error)
      );

      return this.instance;
   }
}
```

#### #2. Interceptor builder

```typescript
import InterceptorBuilder from "interceptor-builder";
import MyInterceptor from "...";

const axiosInstance = axios.create();
return new InterceptorBuilder(this.instance) //
   .use(MyInterceptor)
   .build();
```

## 📄 License

This package is open-source and available under the MIT License.
