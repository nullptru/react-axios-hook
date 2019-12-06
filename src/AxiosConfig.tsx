import React, { PropsWithChildren } from "react"
import { GlobalConfigProps } from "../types"
import Axios from "axios"
import { isObject } from "./utils"

export const AxiosContext = React.createContext(null);

const AxiosConfig: React.FC<GlobalConfigProps> = (props: PropsWithChildren<GlobalConfigProps>) => {
  const { config, instance, options } = props
  let axiosInstance
  let globalOptions = options

  if (instance) {
    axiosInstance = instance
  } else if (config && isObject(config)) {
    axiosInstance = Axios.create(config)
  } else {
    axiosInstance = Axios.create();
  }

  return (
    <AxiosContext.Provider value={{ axiosInstance, globalOptions}}>
      {props.children}
    </AxiosContext.Provider>
  )
}

export default AxiosConfig