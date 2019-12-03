import { AxiosRequestConfig } from "axios";

declare interface AxiosConfigProps {
  config?: AxiosRequestConfig
}

declare interface UseAxiosProps {
  trigger: boolean | (() => boolean);
}

declare interface Response<T> {
  response: T
  loading: boolean
  error: any
}

declare interface RefreshFunc<T> {
  (overwriteConfig?: AxiosRequestConfig, overwriteOptions?: any): Promise<T> | Error
}