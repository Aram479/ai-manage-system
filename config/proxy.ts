export default {
  local: {
    '/server': {
      target: 'http://127.0.0.1:1024',
      pathRewrite: {
        '/server': '',
      },
      secure: false,
      logLevel: 'debug',
      changeOrigin: true,
    },
  },
};
