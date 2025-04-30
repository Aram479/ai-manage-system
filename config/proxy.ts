/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */

  dev: {
    "/api": {
      target: "https://api.deepseek.com/v1",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
    "/ali": {
      target: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      changeOrigin: true,
      pathRewrite: { "^/ali": "" },
    },
  },
  uat: {
    "/api": {
      target: "https://api.deepseek.com/v1",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
    "/ali": {
      target: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      changeOrigin: true,
      pathRewrite: { "^/ali": "" },
    },
    "/dify": {
      target: "http://127.0.0.1/v1",
      changeOrigin: true,
      pathRewrite: { "^/dify": "" },
    },
  },
};
