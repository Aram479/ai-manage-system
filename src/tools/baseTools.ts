export enum BaseToolsEvents {
  Navigate_Page = "Navigate_Page",
}

/* 根据Schema模型推导结果类型 */
export type INavigate_page = JSONSchemaToType<
  typeof navigate_page.function.parameters
>;

/* 整合 结果类型 */
export type TBaseTools = INavigate_page;

export const navigate_page = {
  type: "function",
  function: {
    name: BaseToolsEvents.Navigate_Page,
    description: "跳转到指定系统页面",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称", // 设置 "必填" 二字，AI才会保证输出此字段
          enum: [BaseToolsEvents.Navigate_Page],
        },
        path: {
          type: "string",
          description: "目标页面路径",
          enum: ["/Main", "/UserManage"], // getAllPaths(routes)
        },
      },
      required: ["event", "path"],
    },
  },
} as const;
