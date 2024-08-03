import devConfig from "./config.dev";
import prodConfig from "./config.prod";
import { defineConfig } from "@umijs/max";

const env = process.env;
const envConfig = env.mode === "prod" ? prodConfig : devConfig;

export default defineConfig({
  alias: {
    "@": "/src",
    "@packages": "/packages",
  },
  ...envConfig,
});
