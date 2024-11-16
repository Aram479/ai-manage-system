import { ConfigModel } from './config.model';

const routes: ConfigModel['routes'] = [
  { path: '/404', component: '@/pages/404', layout: false },
  {
    path: '/',
    component: '@/layouts/index',
    layout: false,
    routes: [
      { path: '', redirect: '/start' },
      { path: 'start', component: '@/pages/index' },
    ],
  },
  { path: '*', redirect: '/404' },
];

export default routes;
