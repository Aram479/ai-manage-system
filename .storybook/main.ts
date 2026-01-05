import type { StorybookConfig } from "@storybook/react-webpack5";
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling",
      options: {
        // https://github.com/umijs/umi/blob/master/packages/bundler-webpack/src/config/cssRules.ts
        cssModules: {
          localIdentName: "[local]___[hash:base64:5]",
          // 关键就这这一句，所有文件都视为css module
          auto: () => true,
        },
        css: {
          importLoaders: 1,
          esModule: true,
          url: {
            filter: (url: string) => {
              // Don't parse absolute URLs
              // ref: https://github.com/webpack-contrib/css-loader#url
              if (url.startsWith("/")) return false;
              return true;
            },
          },
          import: true,
        },
        less: {
          // Require your Less preprocessor here
          implementation: require("less"),

          javascriptEnabled: true,
        },
      },
    },
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    // 添加或修改别名
    config.resolve = config.resolve || {};
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    // 返回新的配置
    return config;
  },
};
export default config;
