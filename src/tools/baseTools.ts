import { BaseToolsNames } from "@/constant/tools.constant";

const navigate_page_tool = {
  type: "function",
  function: {
    name: BaseToolsNames.Navigate_Page,
    description: "跳转到指定系统页面",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
          emun: [BaseToolsNames.Navigate_Page],
        },
        path: {
          type: "string",
          description: "目标页面路径",
          enum: ["/Main", "/UserManage"], // getAllPaths(routes)
        },
      },
    },
    required: ["path"],
  },
};

export { navigate_page_tool };
