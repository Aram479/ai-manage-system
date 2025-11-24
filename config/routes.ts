import {
  HomeOutlined,
  PieChartOutlined,
  ProfileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const routes: IRouteTypes[] = [
  {
    path: "/Login",
    component: "@/pages/Login",
    layout: false,
    wrappers: ["@/wrappers/auth"],
  },
  // 管理系统相关页面
  {
    name: "System",
    path: "/",
    wrappers: ["@/wrappers/auth"],
    routes: [
      {
        path: "/",
        redirect: "/Main",
      },
      {
        name: "Main",
        path: "/Main",
        component: "@/pages/Main",
        meta: {
          title: "首页",
          icon: HomeOutlined,
        },
      },
      {
        name: "Charts",
        path: "/Charts",
        component: "@/pages/Charts",
        meta: {
          title: "图表",
          icon: PieChartOutlined,
        },
      },
      {
        name: "UserManage",
        path: "/UserManage",
        component: "@/pages/UserManage",
        meta: {
          title: "用户管理",
          icon: UserOutlined,
        },
      },
      {
        name: "OrderManage",
        path: "/OrderManage",
        component: "@/pages/OrderManage",
        meta: {
          title: "订单管理",
          icon: ProfileOutlined,
        },
      },
      {
        name: "RoleManage",
        path: "/RoleManage",
        component: "@/pages/RoleManage",
        meta: {
          title: "角色管理",
          icon: TeamOutlined,
        },
      },
      {
        name: "FormAssignPage",
        path: "/FormAssignPage",
        component: "@/pages/FormAssignPage",
        meta: {
          title: "表单赋值",
          icon: ProfileOutlined,
        },
      },
      {
        name: "AutoChat",
        path: "/AutoChat",
        component: "@/pages/AutoChat",
        meta: {
          title: "自动对话",
          icon: ProfileOutlined,
        },
      },
      {
        name: "ChatRoom",
        path: "/ChatRoom",
        component: "@/pages/ChatRoom",
        meta: {
          title: "聊天室",
          icon: ProfileOutlined,
        },
      },
      // {
      //   name: "WorkFlow",
      //   path: "/WorkFlow",
      //   component: "@/pages/WorkFlow",
      //   meta: {
      //     title: "工作流(未完善)",
      //     icon: MergeOutlined
      //   },
      // },
    ],
  },
  // 全屏的 AI页面
  {
    name: "ScreenChat",
    path: "/ScreenChat",
    component: "@/pages/ScreenChat",
    layout: false,
  },
  /* 聊天相关页面 */
  {
    path: "/Chats",
    component: "@/pages/ChatLayout",
    layout: false,
    routes: [
      {
        path: "/Chats/Chat",
        component: "@/pages/Chat",
        layout: false,
      },
    ],
  },
  { path: "/404", component: "@/pages/404", layout: false },
  { path: "*", redirect: "/404", layout: false },
];
export default routes;
