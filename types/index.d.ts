import { AxiosRequestConfig } from "axios";

declare interface AxiosConfigProps {
  config?: AxiosRequestConfig
}

declare interface UseAxiosProps {
  manual: boolean
}

declare interface Response<T> {
  data: T,
  loading: boolean,
  error: any
}

declare interface RefreshFunc<T> {
  (overwriteConfig?: any): Response<T>
}