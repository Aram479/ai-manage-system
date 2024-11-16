import devConfig from './config.dev';
import prodConfig from './config.prod';
import { defineConfig } from '@umijs/max';
import routes from './routes';

const env = process.env;
const envConfig = env.mode === 'prod' ? prodConfig : devConfig;

export default defineConfig({
  // model: {},  开启 useModel
  alias: {
    '@': '/src',
    '@packages': '/packages',
  },
  layout: false,
  routes, // 开始配置式路由
  title: '松果umi',
  ...envConfig,
});
