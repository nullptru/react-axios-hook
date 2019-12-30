import Axios, { AxiosRequestConfig, AxiosInstance, CancelTokenSource } from 'axios'
import { UseAxiosProps, Response, RefreshFunc } from '../types'
import { useContext, useReducer, useCallback, useEffect, useRef } from 'react'
import { AxiosContext } from './AxiosConfig'

interface Action {
  type: string
  payload?: any
}

enum ActionEnum {
  REQUEST_START = 'REQUEST_START',
  REQUEST_SUCCESS = 'REQUEST_SUCCESS',
  REQUEST_ERROR = 'REQUEST_ERROR',
  REQUEST_CANCEL = 'REQUEST_CANCEL',
}

function normalizeConfig(config: AxiosRequestConfig | string): AxiosRequestConfig {
  if (typeof config === 'string') {
    // only url
    return { url: config }
  } else {
    return config
  }
}

function useAxios<T = any>(config: AxiosRequestConfig | string, options: UseAxiosProps): [Response<T>, RefreshFunc<T>] {
  const globalConfig = useContext(AxiosContext) || {}
  const axiosConfig = normalizeConfig(config)
  const hookOptions = { trigger: true, cancelable: false, ...globalConfig.globalOptions, ...options }
  const axiosInstance: AxiosInstance = globalConfig.axiosInstance || Axios.create()

  const cancelSource = useRef<CancelTokenSource>()

  const reducer = useCallback((state: Response<T>, action: Action): Response<T> => {
    switch (action.type) {
      case ActionEnum.REQUEST_START:
        return { ...state, loading: true, response: undefined, error: undefined, isCancel: false }
      case ActionEnum.REQUEST_SUCCESS:
        return { ...state, loading: false, response: action.payload, error: undefined, isCancel: false }
      case ActionEnum.REQUEST_ERROR:
        return { ...state, loading: false, response: undefined, error: action.payload, isCancel: false }
      case ActionEnum.REQUEST_CANCEL:
        return { ...state, loading: false, response: undefined, error: action.payload, isCancel: true }
      default:
        return state
    }
  }, [])
  const [state, dispatch] = useReducer(reducer, {
    response: undefined,
    error: undefined,
    loading: false,
    isCancel: false,
  })

  // for reactive detect
  const stringifyConfig = JSON.stringify(axiosConfig)

  const refresh = useCallback(
    (
      overwriteConfig?: AxiosRequestConfig | string,
      overwriteOptions?: UseAxiosProps /* for further use*/
    ): Promise<T> | Error => {
      // if should cancel, cancel last request
      if (cancelSource.current) {
        cancelSource.current.cancel()
      }
      const options = { ...hookOptions, ...overwriteOptions }
      // add new cancel source
      cancelSource.current = options.cancelable ? Axios.CancelToken.source() : undefined
      dispatch({ type: ActionEnum.REQUEST_START })
      return axiosInstance
        .request<AxiosRequestConfig, T>({
          ...axiosConfig,
          ...normalizeConfig(overwriteConfig),
          cancelToken: (cancelSource.current || {}).token,
        })
        .then((res: T) => {
          dispatch({
            type: ActionEnum.REQUEST_SUCCESS,
            payload: res,
          })
          return res
        })
        .catch((error: any) => {
          if (Axios.isCancel(error)) {
            dispatch({
              type: ActionEnum.REQUEST_CANCEL,
              payload: error,
            })
          }
          dispatch({
            type: ActionEnum.REQUEST_ERROR,
            payload: error,
          })
          throw error
        })
    },
    [stringifyConfig]
  )
  // start request
  useEffect(() => {
    const shouldFetch = typeof hookOptions.trigger === 'function' ? hookOptions.trigger() : hookOptions.trigger
    if (shouldFetch) {
      refresh()
    }
  }, [stringifyConfig])

  return [state, refresh]
}

export default useAxios
