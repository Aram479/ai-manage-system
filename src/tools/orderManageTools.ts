import {
  DeliveryTypeOptions,
  GoodsOptions,
  PayTypeOptions,
} from "@/constant/options";

/* 事件集合 */
export enum OrderManageToolsEvents {
  Search_Order = "Search_Order",
  Create_Order = "Create_Order",
  Export_OrderList = "Export_OrderList",
}

/* 整合 结果类型 */
export type TOrderManageTools = ExtractFunctionParameters<
  typeof OrderManageToolsFunctions
>[keyof typeof OrderManageToolsFunctions];

// 事件统一字段
const eventProperties = (props: TToolsProps) => {
  return {
    path: {
      type: "string",
      description: "目标页面路径",
      enum: ["/OrderManage"],
    },
  } as const;
};

// 搜索字段
const searchProperties = (props: TToolsProps) => {
  return {
    orderNo: {
      type: "string",
      description: "订单号，命名规则：O[订单日期][订单排号]",
    },
    orderName: {
      type: "string",
      description: "订单名称",
    },
    createTime: {
      type: "string",
      format: "date",
      description: "创建时间 或者 构建时间 或者 Build date",
    },
  } as const;
};

// 创建订单字段
const createOrderProperties = (props: TToolsProps) => {
  return {
    username: {
      type: "string",
      description: "用户名",
    },
    goodsName: {
      type: "string",
      description: "商品的名称，必填项，值为value字段",
      enum: GoodsOptions,
    },
    payType: {
      type: "string",
      description: "用户支付方式，必填项，值为value字段",
      enum: PayTypeOptions,
    },
    deliveryType: {
      type: "string",
      description: "配送方式：必填项，值为value字段",
      enum: DeliveryTypeOptions,
    },
    deliveryTime: {
      type: "string",
      format: "date",
      description: "配送时间",
    },
  } as const;
};

const search_order = (props?: any) => {
  return {
    type: "function",
    function: {
      name: OrderManageToolsEvents.Search_Order,
      description: "搜索订单数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [OrderManageToolsEvents.Search_Order],
          },
          // 定义此项时，将不支持页面跳转
          // toolType: {
          //   type: "string",
          //   description: "工具类型，api：调用接口",
          //   enum: ["api"],
          // },
          data: {
            type: "object",
            description: "需要用到的数据",
            properties: {
              ...searchProperties(props),
            },
            required: ["name"],
          },
        },
        required: ["name", "toolType", "data"],
      },
    },
  } as const;
};

const create_order = (props?: any) => {
  return {
    type: "function",
    function: {
      name: OrderManageToolsEvents.Create_Order,
      description: "创建订单数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [OrderManageToolsEvents.Create_Order],
          },
          data: {
            type: "object",
            description: "需要用到的数据",
            properties: {
              ...createOrderProperties(props),
            },
            required: [
              "username",
              "goodsName",
              "payType",
              "deliveryType",
              "deliveryTime",
            ],
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

const export_orderList = (props?: any) => {
  return {
    type: "function",
    function: {
      name: OrderManageToolsEvents.Export_OrderList,
      description: "导出订单数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [OrderManageToolsEvents.Export_OrderList],
          },
          // 定义此项时，将不支持页面跳转
          toolType: {
            type: "string",
            description: "工具类型，api：调用接口",
            enum: ["api"],
          },
        },
        required: ["name"],
      },
    },
  } as const;
};

export const OrderManageToolsFunctions = {
  search_order,
  create_order,
  export_orderList,
} as const;
