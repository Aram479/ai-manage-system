import { defineConfig } from "@umijs/max";
import routes from "./routes";
import proxy from "./proxy";
import CompressionPlugin from "compression-webpack-plugin";
const { UMI_ENV } = process.env;

const env = require(`./.env${UMI_ENV ? "." + UMI_ENV : ""}.ts`).default;

export default defineConfig({
  hash: true, //根据文件内容生成文件名的哈希版本，以确保每次构建后生成的文件名都是唯一的。配合禁止浏览器缓存index.html，确保用户每次加载最新的文件。
  model: {}, // 开启 useModel
  layout: false,
  routes, // 开始配置式路由
  publicPath: "/",
  title: "Veloce",
  base: "/", //路由前缀
  locale: {
    default: "zh-CN",
  },
  request: {},
  esbuildMinifyIIFE: true,
  devtool: UMI_ENV === "pro" ? "source-map" : false,
  favicons: ["/favicon.ico"],
  initialState: {},
  define: env,
  proxy: (proxy as any)[UMI_ENV || "dev"],
  npmClient: "pnpm",
  chainWebpack(config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: "all",
          maxInitialRequests: 10,
          maxAsyncRequests: 15,
          minSize: 1000,
          cacheGroups: {
            // 单独拆分 antd（高频、大体积）
            antd: {
              name: "chunk-antd",
              test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // 拆分 lodash（常被全量引入）
            lodash: {
              name: "chunk-lodash",
              test: /[\\/]node_modules[\\/]lodash/,
              priority: 12,
              reuseExistingChunk: true,
            },
            // 其他 node_modules
            defaultVendors: {
              name: "chunk-vendors",
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
            },
            // 公共业务代码（可选）
            default: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      },
    });

    // Gzip 压缩（保留你原有逻辑）
    if (UMI_ENV === "pro") {
      config.plugin("compression-webpack-plugin").use(CompressionPlugin, [
        {
          algorithm: "gzip",
          test: /\.(js|css|html)$/i,
          threshold: 10240,
          deleteOriginalAssets: false,
        },
      ]);
    }
  },
});
