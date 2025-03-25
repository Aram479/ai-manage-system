import { defineConfig } from "@umijs/max";
import routes from "./routes";
import proxy from "./proxy";
const { UMI_ENV } = process.env;

const env = require(`./.env${UMI_ENV ? "." + UMI_ENV : ""}.ts`).default;

export default defineConfig({
  hash: true, //根据文件内容生成文件名的哈希版本，以确保每次构建后生成的文件名都是唯一的。配合禁止浏览器缓存index.html，确保用户每次加载最新的文件。
  // model: {}, // 开启 useModel
  layout: false,
  routes, // 开始配置式路由
  title: "AI-Project",
  base: "/", //路由前缀
  request: {
    dataField: "data",
  },
  initialState: {},
  esbuildMinifyIIFE: true,
  define: env,
  proxy: (proxy as any)[UMI_ENV || "dev"],
  npmClient: "pnpm",
});
