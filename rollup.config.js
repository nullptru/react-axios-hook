import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";

const ENV = process.env.NODE_ENV;

const fileMap = {
  cjs: "use-axios.common",
  esm: "use-axios.esm",
  umd: "use-axios"
};

module.exports = {
  input: "src/index.ts",
  plugins: [typescript(), resolve(), commonjs(), json()],
  external: ["react", "react-dom", "axios"],
  output: Object.keys(fileMap).map(type => ({
    file: `dist/${fileMap[type]}${ENV === "production" ? ".min" : ""}.js`,
    format: type,
    name: type === "umd" ? "useAxios" : undefined,
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
      axios: "axios"
    }
  }))
};
