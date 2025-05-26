import { defineConfig } from "@umijs/max";

type RoutesType = Parameters<typeof defineConfig>[0]["routes"];
const routes: RoutesType = [
  // 管理系统相关页面
  {
    name: "System",
    path: "/",
    routes: [
      {
        name: "Main",
        path: "/Main",
        component: "@/pages/Main",
        meta: {
          title: "首页",
        },
      },
      {
        name: "Charts",
        path: "/Charts",
        component: "@/pages/Charts",
        meta: {
          title: "图表",
        },
      },
      {
        name: "UserManage",
        path: "/UserManage",
        component: "@/pages/UserManage",
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "OrderManage",
        path: "/OrderManage",
        component: "@/pages/OrderManage",
        meta: {
          title: "订单管理",
        },
      },
      {
        name: "RoleManage",
        path: "/RoleManage",
        component: "@/pages/RoleManage",
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "WorkFlow",
        path: "/WorkFlow",
        component: "@/pages/WorkFlow",
        meta: {
          title: "工作流",
        },
      },
    ],
  },
  /* 聊天相关页面 */
  {
    path: "/Chats",
    component: "@/pages/ChatLayout",
    layout: false,
    // redirect: "/Chats/Chat",
    routes: [
      {
        path: "/Chats/Chat",
        component: "@/pages/Chat",
        layout: false,
      },
      {
        path: "/Chats/AutoChat",
        component: "@/pages/AutoChat",
        layout: false,
      },
    ],
  },
  {
    path: "/demo",
    component: "@/pages/Demo",
    layout: false,
  },
  { path: "/404", component: "@/pages/404", layout: false },
  { path: "*", redirect: "/404", layout: false },
];

export default routes;
