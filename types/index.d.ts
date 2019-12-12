import { AxiosRequestConfig, AxiosInstance } from "axios";

declare interface GlobalConfigProps {
  config?: AxiosRequestConfig
  instance?: AxiosInstance
  options?: UseAxiosProps
}

declare interface UseAxiosProps {
  trigger: boolean | (() => boolean);
  cancelable: boolean
}

declare interface Response<T> {
  response: T
  loading: boolean
  error: any
  isCancel: boolean
}

declare interface RefreshFunc<T> {
  (overwriteConfig?: AxiosRequestConfig, overwriteOptions?: any): Promise<T> | Error
}