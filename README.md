<h1 align="center">Interceptor Builder</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/interceptor-builder">
    <img src="https://img.shields.io/npm/v/interceptor-builder.svg" alt="NPM Version">
  </a>
  <a href="https://www.npmjs.com/package/interceptor-builder">
    <img src="https://img.shields.io/npm/l/interceptor-builder.svg" alt="License">
  </a>
  <a href="https://github.com/riteshmyhub/interceptor-builder">
    <img src="https://img.shields.io/github/last-commit/riteshmyhub/interceptor-builder.svg" alt="Last Commit">
  </a>
</p>

<p align="center">
  A clean and extendable interceptor builder for chaining and organizing multiple request/response interceptors.
</p>

---

## ✨ Features

-  🔗 **Chainable API**: Easily chain multiple interceptors together.
-  🔧 **Extendable**: Create your own custom interceptors with ease.
-  📦 **Lightweight**: No external dependencies.
-  ✅ **Typed**: Written in TypeScript for a better developer experience.
-  universal: Works with any HTTP client that supports interceptors (e.g., Axios, Fetch).

---

## 📚 Table of Contents

-  [Installation](#-installation)
-  [Getting Started](#-getting-started)
-  [Usage Examples](#-usage-examples)
-  [API Reference](#-api-reference)
-  [Contributing](#-contributing)
-  [License](#-license)

---

## 📦 Installation

```bash
npm install interceptor-builder
```

---

## 🚀 Getting Started

#### #1. Create an HTTP client instance

First, create an instance of your preferred HTTP client. In this example, we'll use Axios.

```typescript
import axios from "axios";

const instance = axios.create({
   baseURL: "http://localhost:5173/",
});
```

#### #2. Create a custom interceptor

Next, create a custom interceptor by implementing the `Interceptor` interface.

```typescript
import type { Interceptor, Req, Res, Instance } from "interceptor-builder";

export default class MyInterceptor implements Interceptor {
   public instance: Instance;

   constructor(instance: Instance) {
      this.instance = instance;
   }

   intercept(req: Req, res: Res): Instance {
      req.use(
         (config) => {
            console.log("Request interceptor");
            return config;
         },
         (error) => Promise.reject(error)
      );

      res.use(
         (response) => {
            console.log("Response interceptor");
            return response;
         },
         (error) => Promise.reject(error)
      );

      return this.instance;
   }
}
```

#### #3. Build the interceptor chain

Finally, use the `InterceptorBuilder` to chain your interceptors and build the final instance.

```typescript
import InterceptorBuilder from "interceptor-builder";
import MyInterceptor from "./MyInterceptor";
import LoadingInterceptor from "./LoadingInterceptor";
import TokenInterceptor from "./TokenInterceptor";

const instance = axios.create({
   baseURL: "http://localhost:5173/",
});

const enhancedInstance = new InterceptorBuilder(instance).use(MyInterceptor).use(LoadingInterceptor).use(TokenInterceptor).build();

export default enhancedInstance;
```

---

## 💡 Usage Examples

Here are some examples of custom interceptors you can create.

### `loading.interceptor.ts`

This interceptor shows a loading indicator during a request.

```typescript
import type { AxiosInstance } from "axios";
import type { Interceptor, Req, Res } from "interceptor-builder";

export default class LoadingInterceptor implements Interceptor {
   public instance;

   constructor(instance: AxiosInstance) {
      this.instance = instance;
   }

   private setLoading(loading: boolean) {
      const event = new CustomEvent("loading", { detail: loading });
      window.dispatchEvent(event);
   }

   intercept(request: Req, response: Res) {
      request.use(
         (config) => {
            this.setLoading(true);
            return config;
         },
         (error) => {
            this.setLoading(false);
            return Promise.reject(error);
         }
      );

      response.use(
         (res) => {
            this.setLoading(false);
            return res;
         },
         (error) => {
            this.setLoading(false);
            return Promise.reject(error);
         }
      );

      return this.instance;
   }
}
```

### `token.interceptor.ts`

This interceptor adds an authentication token to the request headers and handles token refreshing.

```typescript
import type { AxiosError, AxiosInstance } from "axios";
import axios from "axios";
import type { Interceptor, Req, Res } from "interceptor-builder";

export default class TokenInterceptor implements Interceptor {
   public instance;
   constructor(instance: AxiosInstance) {
      this.instance = instance;
   }

   protected clear = async () => {
      localStorage.clear();
      setTimeout(() => {
         window.location.replace("/auth/login");
      }, 50);
   };

   private refreshTokenApi = async () => {
      try {
         const { data } = await axios.get("https://dummyjson.com/auth/refresh");
         localStorage.setItem("accessToken", data?.accessToken);
         return data;
      } catch (error) {
         this.clear();
         return error;
      }
   };

   private getToken = async () => {
      const token = {
         accessToken: (localStorage.getItem("accessToken") as string) || "",
      };
      return token;
   };

   intercept(request: Req, response: Res) {
      request.use(
         async (config) => {
            const token = await this.getToken();
            if (token) config.headers.Authorization = `Bearer ${token.accessToken}`;
            return config;
         },
         (error) => Promise.reject(error)
      );

      response.use(
         (res) => res,
         async (error: AxiosError) => {
            try {
               const status = error.response?.status;
               const originalRequest = error.config as any;
               if (status === 401 && !originalRequest?._retry) {
                  originalRequest._retry = true;
                  const token = await this.getToken();
                  if (!token.refreshToken) return;
                  /*---refreshTokenApi---*/
                  const data = await this.refreshTokenApi();
                  if (data?.accessToken) {
                     originalRequest.headers["Authorization"] = `Bearer ${data?.accessToken}`;
                     return axios(originalRequest);
                  }
               }
               return Promise.reject(error);
            } catch (error) {
               return Promise.reject(error);
            }
         }
      );
      return this.instance;
   }
}
```

---

## 📖 API Reference

### `InterceptorBuilder`

The main class for building the interceptor chain.

| Method    | Description                                          |
| :-------- | :--------------------------------------------------- |
| `use()`   | Adds an interceptor to the chain.                    |
| `build()` | Builds the final instance with all the interceptors. |

### `Interceptor`

The interface that all interceptors must implement.

| Property      | Description                                         |
| :------------ | :-------------------------------------------------- |
| `instance`    | The HTTP client instance.                           |
| `intercept()` | The method where you define your interceptor logic. |

### Types

The package also provides the following types:

-  `Req`: The request interceptor manager.
-  `Res`: The response interceptor manager.
-  `Instance`: The HTTP client instance.

---

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

---

## 📄 License

This package is open-source and available under the [ISC License](LICENSE).
