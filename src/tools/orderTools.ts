import {
  DeliveryTypes,
  PayTypeOptions,
  PayTypes,
} from "@/constant/options.constant";

export enum OrderToolsEvents {
  Search_Order = "Search_Order",
  Create_Order = "Create_Order",
}

/* 根据Schema模型推导结果类型 */
export type ISearch_Order = JSONSchemaToType<
  typeof search_Order.function.parameters
>;

export type ICreate_Order = JSONSchemaToType<
  typeof create_Order.function.parameters
>;

/* 整合 结果类型 */
export type TOrderTools = ISearch_Order | ICreate_Order;

export const search_Order = {
  type: "function",
  function: {
    name: OrderToolsEvents.Search_Order,
    description: "跳转到订单管理页面，并搜索或输入查询数据",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
          enum: [OrderToolsEvents.Search_Order],
        },
        path: {
          type: "string",
          description: "目标页面路径",
          enum: ["/OrderManage"], // getAllPaths(routes)
        },
        orderNo: {
          type: "integer",
          description: "订单号",
        },
        orderName: {
          type: "string",
          description: "订单名称",
        },
        startTime: {
          type: "string",
          format: "date",
          description: "订单开始时间",
        },
        endTime: {
          type: "string",
          format: "date",
          description: "订单结束时间",
        },
        // is_vip: {
        //   type: "boolean",
        //   description: "是否为VIP用户",
        // },
      },
      required: [
        "event",
        "path",
        "orderNo",
        "orderName",
        "startTime",
        "endTime",
      ],
    },
  },
} as const;

export const create_Order = {
  type: "function",
  function: {
    name: OrderToolsEvents.Create_Order,
    description: "跳转到订单管理页面，创建订单数据",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
          enum: [OrderToolsEvents.Create_Order],
        },
        path: {
          type: "string",
          description: "目标页面路径",
          enum: ["/OrderManage"], // getAllPaths(routes)
        },
        username: {
          type: "string",
          description: "用户名",
        },
        goodsName: {
          type: "string",
          description: "商品的名称",
        },
        payType: {
          type: "string",
          description: "用户支付方式",
          enum: PayTypes,
        },
        deliveryType: {
          type: "string",
          description: "配送方式",
          enum: DeliveryTypes,
        },
        deliveryTime: {
          type: "string",
          format: 'date',
          description: "配送时间",
        },
        // is_vip: {
        //   type: "boolean",
        //   description: "是否为VIP用户",
        // },
      },
      required: [
        "event",
        "path",
        "username",
        "goodsName",
        "payType",
        "deliveryType",
        "deliveryTime",
      ],
    },
  },
} as const;
