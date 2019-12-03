import { AxiosRequestConfig, AxiosInstance } from "axios";
import { UseAxiosProps, Response, RefreshFunc, AxiosConfigProps } from "../types";
import { useContext, useReducer, useCallback, useEffect } from "react";
import { AxiosContext } from "./AxiosConfig";

interface Action {
  type: string
  payload?: any
}

enum ActionEnum {
  REQUEST_START = 'REQUEST_START',
  REQUEST_SUCCESS = 'REQUEST_SUCCESS',
  REQUEST_ERROR = 'REQUEST_ERROR'
}

function useAxios<T = any>(config: AxiosRequestConfig | string, options: UseAxiosProps): [Response<T>, RefreshFunc<T>] {
  let axiosConfig = {}
  let hookOptions = { trigger: true, ...options }

  const axiosInstance: AxiosInstance = useContext(AxiosContext)

  const reducer = useCallback((state: Response<T>, action: Action): Response<T> => {
    switch (action.type) {
      case ActionEnum.REQUEST_START:
        return { ...state, loading: true };
      case ActionEnum.REQUEST_SUCCESS:
        return { ...state, loading: false, response: action.payload }
      case ActionEnum.REQUEST_ERROR:
        return { ...state, loading: false, response: undefined, error: action.payload }
      default:
        return state
    }
  }, []);

  const [state, dispatch] = useReducer(reducer, { response: undefined, error: undefined, loading: false })

  if (typeof config === 'string') { // only url
    axiosConfig = { url: config }
  } else {
    axiosConfig = config
  }

  // for reactive detect
  const stringifyConfig = JSON.stringify(axiosConfig);

  const refresh = useCallback((overwriteConfig?: AxiosRequestConfig, overwriteOptions?: UseAxiosProps/* for further use*/): Promise<T> | Error => {
    return axiosInstance.request<AxiosRequestConfig, T>({ ...axiosConfig, ...overwriteConfig }).then((res: T) => {
      dispatch({
        type: ActionEnum.REQUEST_START,
        payload: res
      })
      return res;
    }).catch((error: any) => {
      dispatch({
        type: ActionEnum.REQUEST_ERROR,
        payload: error
      })
      throw error;
    })
  }, [stringifyConfig]);

  // start request
  useEffect(() => {
    if (options.trigger) {
      refresh();
    }
  }, [stringifyConfig])

  return [state, refresh];
}

export default useAxios