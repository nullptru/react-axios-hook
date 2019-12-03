import React, { PropsWithChildren } from "react"
import { AxiosConfigProps } from "../types"
import Axios from "axios"
import { isObject } from "./utils"

export const AxiosContext = React.createContext(null);

const AxiosConfig: React.FC<AxiosConfigProps> = (props: PropsWithChildren<AxiosConfigProps>) => {
  const { config } = props
  let axiosInstance

  if (isObject(config)) {
    axiosInstance = Axios.create(config)
  } else {
    axiosInstance = Axios.create()
  }

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {props.children}
    </AxiosContext.Provider>
  )
}

export default AxiosConfig