import React, { PropsWithChildren, useRef } from 'react'
import { GlobalConfigProps } from '../types'
import Axios, { AxiosInstance } from 'axios'
import { isObject } from './utils'

export const AxiosContext = React.createContext(null)

const AxiosConfig: React.FC<GlobalConfigProps> = (props: PropsWithChildren<GlobalConfigProps>) => {
  const { config, instance, options } = props
  const axiosInstanceRef = useRef<AxiosInstance>()
  const globalOptions = options

  if (instance) {
    axiosInstanceRef.current = instance
  } else if (config && isObject(config)) {
    axiosInstanceRef.current = Axios.create(config)
  } else {
    axiosInstanceRef.current = Axios.create()
  }

  return (
    <AxiosContext.Provider value={{ axiosInstance: axiosInstanceRef.current, globalOptions }}>
      {props.children}
    </AxiosContext.Provider>
  )
}

export default AxiosConfig
