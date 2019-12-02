import { AxiosRequestConfig } from "axios";
import { UseAxiosProps, Response, RefreshFunc } from "../types";

function useAxios<T = any> (config: AxiosRequestConfig, hookConfig: UseAxiosProps): [Response<T>, RefreshFunc<T>] {
  let response: Response<T> = { data: undefined, error: undefined, loading: false };

  const refresh: (overwriteConfig: any) => Response<T> =(overwriteConfig) => {
    return response;
  }
  return [response, refresh];
}

export default useAxios