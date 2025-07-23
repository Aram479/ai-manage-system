import { DeliveryTypeOptions, PayTypeOptions } from "@/constant/options";

/* 事件集合 */
export enum OrderManageToolsEvents {
  Search_Order = "Search_Order",
  Create_Order = "Create_Order",
  Edit_Order = "Edit_Order",
  Delete_Order = "Delete_Order",
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
    userName: {
      type: "string",
      description: "用户名称",
    },
    goodsName: {
      type: "string",
      description: "商品名称",
    },
    goodsPrice: {
      type: "number",
      description: "商品价格",
    },
    createTime: {
      type: "string",
      format: "date",
      description:
        "创建时间 或者 构建时间 或者 Build date: 格式为YYYY-MM-DD hh:mm:ss",
    },
  } as const;
};

// 创建/修改/删除订单所需字段
const orderDataProperties = (props: TToolsProps) => {
  const { orderList } = props;

  return {
    id: {
      type: "string",
      description:
        "用户唯一标识(ID): 数字或字符串类型，创建用户不需要id字段，修改用户时根据用户名称获取对应字段值",
      enum: orderList,
    },
    orderNo: {
      type: "string",
      description:
        "订单号， 必填项，创建订单时需要命名规则：[订单日期][订单排号]，修改订单需要根据用户名称获取对应此字段值",
      enum: orderList,
    },
    userName: {
      type: "string",
      description: "用户名称",
    },
    goodsName: {
      type: "string",
      description: "商品名称",
    },
    goodsPrice: {
      type: "number",
      description: "商品价格",
    },
    goodsDesc: {
      type: "string",
      description: "商品描述",
    },
    goodsCount: {
      type: "number",
      description: "数量、商品数量",
    },
    payType: {
      type: "string",
      escription: "用户支付方式：必填项",
      enum: PayTypeOptions.map((item) => item.value),
    },
    deliveryType: {
      type: "string",
      description: "配送方式：必填项",
      enum: DeliveryTypeOptions.map((item) => item.value),
    },
    deliveryTime: {
      type: "string",
      format: "date",
      description: "配送时间: 格式为YYYY-MM-DD hh:mm:ss",
    },
    createTime: {
      type: "string",
      format: "date",
      description: "创建时间: 格式为YYYY-MM-DD hh:mm:ss",
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
            required: ["userName", "goodsName", "goodsPrice", "createTime"],
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
              ...orderDataProperties(props),
            },
            required: [
              "orderNo",
              "userName",
              "goodsName",
              "goodsPrice",
              "goodsDesc",
              "goodsCount",
              "payType",
              "deliveryType",
              "deliveryTime",
              "createTime",
            ],
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

const edit_order = (props?: any) => {
  return {
    type: "function",
    function: {
      name: OrderManageToolsEvents.Edit_Order,
      description: "修改订单数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [OrderManageToolsEvents.Edit_Order],
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
              ...orderDataProperties(props),
            },
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

const delete_order = (props?: any) => {
  return {
    type: "function",
    function: {
      name: OrderManageToolsEvents.Delete_Order,
      description: "删除订单数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [OrderManageToolsEvents.Delete_Order],
          },
          data: {
            type: "object",
            description: "需要用到的数据",
            properties: {
              ...orderDataProperties(props),
            },
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
            description: "工具类型: 必填项，api：调用接口",
            enum: ["api"],
          },
        },
        required: ["name", "toolType"],
      },
    },
  } as const;
};

export const OrderManageToolsFunctions = {
  search_order,
  create_order,
  edit_order,
  delete_order,
  export_orderList,
} as const;
