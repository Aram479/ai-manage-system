
export enum OrderToolsEvents {
  Search_Order = "Search_Order",
}

/* 根据Schema模型推导结果类型 */
export type ISearch_Order = JSONSchemaToType<
  typeof search_Order.function.parameters
>;

/* 整合 结果类型 */
export type TOrderTools = ISearch_Order;

export const search_Order = {
  type: "function",
  function: {
    name: OrderToolsEvents.Search_Order,
    description: "跳转到指定系统页面，并搜索或输入查询数据",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
          emun: [OrderToolsEvents.Search_Order],
        },
        path: {
          type: "string",
          description: "目标页面路径",
          enum: ["/Main", "/UserManage"], // getAllPaths(routes)
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
      required: ["event", "user", "createTime"],
    },
  },
} as const;
