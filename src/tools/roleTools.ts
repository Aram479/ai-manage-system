/* 事件集合 */
export enum RoleToolsEvents {
  Search_Role = "Search_Role",
  Export_Role = "Export_Role",
}

/* 根据Schema模型推导结果类型 */
export type ISearch_Role = JSONSchemaToType<
  typeof search_Role.function.parameters
>;

export type IExport_Role = JSONSchemaToType<
  typeof export_Role.function.parameters
>;

/* 整合 结果类型 */
export type TRoleTools = ISearch_Role | IExport_Role;

/* 数据模型Schema */
export const search_Role = {
  type: "function",
  function: {
    name: RoleToolsEvents.Search_Role,
    description: "跳转到指定系统页面，并搜索或输入查询数据",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称", // 设置 "必填" 二字，AI才会保证输出此字段
          enum: [RoleToolsEvents.Search_Role],
        },
        path: {
          type: "string",
          description: "目标页面路径",
          enum: ["/RoleManage"], // getAllPaths(routes)
        },
        roles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: {
                type: "string",
                description: "角色名称",
              },
              value: {
                type: "string",
                description: "角色键(value)",
              },
            },
            required: ["label", "value"],
          },
          description: "角色列表",
        },
        createTime: {
          type: "string",
          format: "date",
          description: "创建时间",
        },
      },
      required: ["event", "path", "roles", "createTime"],
    },
  },
} as const;

export const export_Role = {
  type: "function",
  function: {
    name: RoleToolsEvents.Export_Role,
    description: "跳转到指定系统页面，并搜索或输入查询数据",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称", // 设置 "必填" 二字，AI才会保证输出此字段
          enum: [RoleToolsEvents.Export_Role],
        },
        path: {
          type: "string",
          description: "目标页面路径",
          enum: ["/RoleManage"], // getAllPaths(routes)
        },
        role: {
          type: "string",
          description: "角色名称",
        },
        createTime: {
          type: "date",
          format: "date",
          description: "创建时间",
        },
        // age: {
        //   type: "integer",
        //   description: "用户年龄",
        // },
        // is_vip: {
        //   type: "boolean",
        //   description: "是否为VIP用户",
      },
      required: ["event", "roles", "createTime"],
    },
  },
} as const;
