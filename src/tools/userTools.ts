export enum UserToolsEvents {
  Search_User = "Search_User",
}

/* 根据Schema模型推导结果类型 */
export type ISearch_User = JSONSchemaToType<
  typeof search_User.function.parameters
>;

/* 整合 结果类型 */
export type TUserTools = ISearch_User;

/* 数据模型Schema */
export const search_User = {
  type: "function",
  function: {
    name: UserToolsEvents.Search_User,
    description: "跳转到用户管理页面，并搜索或输入查询数据",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
          emun: [UserToolsEvents.Search_User],
        },
        path: {
          type: "string",
          description: "目标页面路径",
          enum: ["/UserManage"], // getAllPaths(routes)
        },
        user: {
          type: "string",
          description: "用户名称",
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
        // },
        // tags: {
        //   type: "array",
        //   items: {
        //     type: "string",
        //   },
        //   description: "用户标签",
        // },
        // address: {
        //   type: "object",
        //   description: "用户地址",
        //   properties: {
        //     street: { type: "string" },
        //     city: { type: "string" },
        //   },
        //   required: ["street"],
        // },
      },
      required: ["event", "path", "user", "createTime"],
    },
  },
} as const;
