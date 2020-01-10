# react-axios-hook

[![Build Status](https://travis-ci.org/nullptru/react-axios-hook.svg?branch=master)](https://travis-ci.org/nullptru/react-axios-hook)
[![npm version](https://badge.fury.io/js/react-axios-hook.svg)](https://badge.fury.io/js/react-axios-hook)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/react-axios-hook)](https://bundlephobia.com/result?p=react-axios-hook)

:fire: A React Hook based on axios.

## Features

- Using Axios with React Hook
- Support Typescript
- Support cancel request
- Global Config with `AxiosConfig` component
- Flexible with config axios or axios instance
- FullControl with axios behavior，support loading status, manual refresh, fetching control...

## Installation

`npm install axios react-axios-hook`

OR

`yarn add axios react-axios-hook`

> `axios` is a peer dependency and needs to be installed explicitly

## Quick Start

### Basic Usage

```javascript
import useAxios from 'react-axios-hook'

function App() {
  const [{ response, loading, error }, refresh] = useAxios('https://www.mxnzp.com/api/holiday/single/20181121', [])

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }
  return loading ? <div>Loading...</div> : (<div>{JSON.stringify(response)}</div>)
}
ReactDOM.render(<App />, document.getElementById('root'))
```

### Global Config

```javascript
import useAxios, { AxiosConfig } from 'react-axios-hook'

function Demo() {
  const [{ response, loading, error }, refresh] = useAxios('https://www.mxnzp.com/api/holiday/single/20181121')

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }
  return loading ? <div>Loading...</div> : (<div>{JSON.stringify(response)}</div>)
}
function App() {
  return (
    <AxiosConfig config={{baseURL: 'https://www.mxnzp.com/api/'}}>
      <Demo />
    </AxiosConfig>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))
```

## Documentation

### API

- [useAxios](#useaxiosurlconfig-options)

## API

The package exports one default export and a name export AxiosConfig:

`import useAxios, { AxiosConfig } from 'react-axios-hook'`

### useAxios(url|config, options?, dependencies?)

The main React hook to execute HTTP requests.

- `url|config` - The request URL or [config](https://github.com/axios/axios#request-config) object, the same argument accepted by `axios`.
- `options` - An options object.
  - `trigger` ( `true` ) - If false, the request is not executed immediately. Useful for non-GET requests that should not be executed when the component renders.
  - `cancelable` ( `false` ) - If true, the last request will be canceled if last request is not finished when new request get into processing.
  - `initResponse` - If set, response will use this value as initial value
- `dependencies` - dependencies array

Returns:

`[{ loading, error, response }, refresh]`

- `loading` - True if the request is in progress, otherwise False.
- `error` - The [error](https://github.com/axios/.axios#handling-errors) value
- `response` - The whole [success response](https://github.com/axios/axios#response-schema) object.
- `isCacel` - True if the request is canceled, otherwise False.

- `refresh([url|config])` - A function to execute the request manually, bypassing the cache by default.
  - `url|config` - Same with useAxios's first parameter, which is _shallow-merged_ with the config object provided when invoking the hook.

## AxiosConfig

`react-axios-hook` uses a default axios object unless you define your own by `AxiosConfig` component.

This component will define a global axiosInstance for further use.

**Attension: This is a React Component**

### Props
- `instance` - the custom `axios` instance your define
- `config`   - [config](https://github.com/axios/axios#request-config) object, the same argument accepted by `axios`, used to create a axios instance
- `options`  - global options
  - `trigger`(`true`)
  - `cancelable`(`false`)

When defining both `instance` and `config`, it will use `instance` and ignore `config` parameter. 

## Credits

`react-axios-hook` is inspired by [axios-hooks](https://github.com/simoneb/axios-hooks) and [swr](https://github.com/zeit/swr)

## License

MIT