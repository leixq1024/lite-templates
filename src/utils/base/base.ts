/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"; //导入的axios本身就是一个实例
import type { AxiosInstance } from "axios";
// import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { IRequsetConfig, IIntercepters } from "./types";
// const requestQueue: { config: InternalAxiosRequestConfig; resolve: any }[] = []; // 存放token失效的请求配置的promise的resolve方法
// const isRefreshing = false;
class Request {
  instance: AxiosInstance;
  interceptors?: IIntercepters;
  constructor(config: IRequsetConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.Intercepters;
    // 请求拦截
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor as any,
      this.interceptors?.requestInterceptorCatch
    );
    // 响应拦截
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      async (err) => {
        const { config, response } = err;
        console.log("👉 ~ Request ~ config, response:", config, response);
        // if (response.status === 401 && !config.url.endsWith("/login")) {
        //   return new Promise(async (resolve) => {
        //     requestQueue.push({ config, resolve }); // accessToken失效后并发请求时，都会失败，把所有的config存起来，刷新完token再请求
        //     if (isRefreshing) return;
        //     isRefreshing = true;
        //     await getToken();
        //     isRefreshing = false;
        //     for (const { resolve, config } of requestQueue) {
        //       config["params"]["access_token"] = getAccessToken();
        //       axios(config).then((res) => {
        //         resolve(res.data);
        //       });
        //     }
        //     requestQueue = [];
        //   });
        // }
        return Promise.reject(err);
      }
    );
  }
  request<T>(config: IRequsetConfig<T>): Promise<T> {
    // 单独拦截
    if (config.Intercepters?.requestInterceptor) {
      config = config.Intercepters.requestInterceptor(config);
    }
    return new Promise((reslove, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单独拦截
          if (config.Intercepters?.responseInterceptor) {
            config = config.Intercepters.responseInterceptor(res) as any;
          }
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /**
   * @param {string} url 路径
   * @param {any} params 参数对象类型
   * @param {boolean} isLoding 是否显示loading
   */
  get<T>(url: string, params?: any, isLoding = false): Promise<T> {
    return new Promise((reslove, reject) => {
      const headers: any = { isLoding: isLoding };
      this.instance
        .get<any, T>(url, { params, headers })
        .then((res) => {
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @param {string} url 路径
   * @param {any} params 参数对象类型
   */
  delte<T>(url: string, params?: any): Promise<T> {
    return new Promise((reslove, reject) => {
      this.instance
        .delete<any, T>(url, { params })
        .then((res) => {
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @param {string} url 路径
   * @param {any} data 参数对象类型
   */
  post<T>(url: string, data?: any, headers?: any): Promise<T> {
    return new Promise((reslove, reject) => {
      this.instance
        .post<unknown, T>(url, data, { headers } as any)
        .then((res) => {
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /**
   * @param {string} url 路径
   * @param {any} data 参数对象类型
   */
  put<T>(url: string, data?: any): Promise<T> {
    return new Promise((reslove, reject) => {
      this.instance
        .put<unknown, T>(url, data)
        .then((res) => {
          reslove(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default Request;
