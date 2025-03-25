import { defineConfig } from "@umijs/max";

type RoutesType = Parameters<typeof defineConfig>[0]["routes"];

const routes: RoutesType = [
  { path: "/404", component: "@/pages/404", layout: false },
  {
    path: "/main",
    component: "@/pages/Main",
    layout: false,
  },
  {
    path: "/demo",
    component: "@/pages/Demo",
    layout: false,
  },
  { path: "*", redirect: "/404" },
];

export default routes;
