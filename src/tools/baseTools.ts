export enum BaseToolsEvents {
  Navigate_Page = "Navigate_Page",
  Update_System_Title = "Update_System_Title",
}

/* 根据Schema模型推导结果类型 */
export type INavigate_page = JSONSchemaToType<
  typeof navigate_page.function.parameters
>;

export type IUpdate_system_title = JSONSchemaToType<
  typeof update_system_title.function.parameters
>;

/* 整合 结果类型 */
export type TBaseTools = INavigate_page | IUpdate_system_title;

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

export const update_system_title = {
  type: "function",
  function: {
    name: BaseToolsEvents.Update_System_Title,
    description: "根据html+css语言，修改当前系统名称/系统标题或者样式",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称", // 设置 "必填" 二字，AI才会保证输出此字段
          enum: [BaseToolsEvents.Update_System_Title],
        },
        title: {
          type: "string",
          description: "根据html+css语言，美化系统名称/系统标题",
          enum: ["欢迎来到Ant Design X Chat 系统"]
        },
      },
      required: ["event", "title"],
    },
  },
} as const;
