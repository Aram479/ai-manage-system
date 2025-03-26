import { defineConfig } from "@umijs/max";

type RoutesType = Parameters<typeof defineConfig>[0]["routes"];

const routes: RoutesType = [
  { path: "/404", component: "@/pages/404", layout: false },
  {
    path: "/DeepSeek",
    component: "@/pages/DeepSeek/Layout",
    layout: false,
    routes: [
      {
        path: "/DeepSeek/:id",
        component: "@/pages/DeepSeek/Main",
        layout: false,
      },
      {
        path: "/DeepSeek/demo",
        component: "@/pages/DeepSeek/Demo",
        layout: false,
      },
    ],
  },
  {
    path: "/Qwen",
    component: "@/pages/DeepSeek/Layout",
    layout: false,
  },

  { path: "*", redirect: "/404" },
];

export default routes;
