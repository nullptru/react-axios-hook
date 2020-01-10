import { AxiosRequestConfig, AxiosInstance } from 'axios'

declare interface GlobalConfigProps {
  config?: AxiosRequestConfig
  instance?: AxiosInstance
  options?: UseAxiosProps<any>
}

declare interface UseAxiosProps<T> {
  trigger: boolean | (() => boolean)
  cancelable?: boolean
  dependencies?: any[]
  initResponse?: T
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
