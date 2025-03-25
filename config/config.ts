import { defineConfig } from "@umijs/max";
import routes from "./routes";
import proxy from "./proxy";
const { UMI_ENV } = process.env;

const env = require(`./.env${UMI_ENV ? "." + UMI_ENV : ""}.ts`).default;

export default defineConfig({
  // model: {}, // 开启 useModel
  layout: false,
  routes, // 开始配置式路由
  title: "AI-Project",
  base: "/", //路由前缀
  request: {
    dataField: "data",
  },
  define: env,
  proxy: (proxy as any)[UMI_ENV || "dev"],
  npmClient: "pnpm",
});
