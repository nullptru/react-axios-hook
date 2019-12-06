(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('axios')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'axios'], factory) :
  (global = global || self, factory(global.useAxios = {}, global.React, global.axios));
}(this, (function (exports, React, Axios) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;
  Axios = Axios && Axios.hasOwnProperty('default') ? Axios['default'] : Axios;

  var isObject = function (o) { return Object.prototype.toString.call(o) === '[object Object]'; };

  var AxiosContext = React__default.createContext(null);
  var AxiosConfig = function (props) {
      var config = props.config, instance = props.instance, options = props.options;
      var axiosInstance;
      var globalOptions = options;
      if (instance) {
          axiosInstance = instance;
      }
      else if (config && isObject(config)) {
          axiosInstance = Axios.create(config);
      }
      else {
          axiosInstance = Axios.create();
      }
      return (React__default.createElement(AxiosContext.Provider, { value: { axiosInstance: axiosInstance, globalOptions: globalOptions } }, props.children));
  };

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  var ActionEnum;
  (function (ActionEnum) {
      ActionEnum["REQUEST_START"] = "REQUEST_START";
      ActionEnum["REQUEST_SUCCESS"] = "REQUEST_SUCCESS";
      ActionEnum["REQUEST_ERROR"] = "REQUEST_ERROR";
  })(ActionEnum || (ActionEnum = {}));
  function normalizeConfig(config) {
      if (typeof config === 'string') { // only url
          return { url: config };
      }
      else {
          return config;
      }
  }
  function useAxios(config, options) {
      var globalConfig = React.useContext(AxiosContext) || {};
      var axiosConfig = normalizeConfig(config);
      var hookOptions = __assign(__assign({ trigger: true }, globalConfig.globalOptions), options);
      var axiosInstance = globalConfig.axiosInstance || Axios.create();
      var reducer = React.useCallback(function (state, action) {
          switch (action.type) {
              case ActionEnum.REQUEST_START:
                  return __assign(__assign({}, state), { loading: true });
              case ActionEnum.REQUEST_SUCCESS:
                  return __assign(__assign({}, state), { loading: false, response: action.payload });
              case ActionEnum.REQUEST_ERROR:
                  return __assign(__assign({}, state), { loading: false, response: undefined, error: action.payload });
              default:
                  return state;
          }
      }, []);
      var _a = React.useReducer(reducer, { response: undefined, error: undefined, loading: false }), state = _a[0], dispatch = _a[1];
      // for reactive detect
      var stringifyConfig = JSON.stringify(axiosConfig);
      var refresh = React.useCallback(function (overwriteConfig, overwriteOptions /* for further use*/) {
          dispatch({ type: ActionEnum.REQUEST_START });
          return axiosInstance.request(__assign(__assign({}, axiosConfig), normalizeConfig(overwriteConfig))).then(function (res) {
              dispatch({
                  type: ActionEnum.REQUEST_SUCCESS,
                  payload: res
              });
              return res;
          })["catch"](function (error) {
              dispatch({
                  type: ActionEnum.REQUEST_ERROR,
                  payload: error
              });
              throw error;
          });
      }, [stringifyConfig]);
      // start request
      React.useEffect(function () {
          if (hookOptions.trigger) {
              refresh();
          }
      }, [stringifyConfig]);
      return [state, refresh];
  }

  exports.AxiosConfig = AxiosConfig;
  exports.default = useAxios;

  Object.defineProperty(exports, '__esModule', { value: true });

})));