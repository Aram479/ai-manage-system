import { DeliveryTypeOptions, PayTypeOptions } from "@/constant/options";

/* 事件集合 */
export enum FormAssignPageToolsEvents {
  Create_Form = "Create_Form",
}

/* 整合 结果类型 */
export type TFormAssignPageTools = ExtractFunctionParameters<
  typeof FormAssignPageToolsFunctions
>[keyof typeof FormAssignPageToolsFunctions];

// 事件统一字段
const eventProperties = (props: TToolsProps) => {
  return {
    path: {
      type: "string",
      description: "目标页面路径",
      enum: ["/FormAssignPage"],
    },
  } as const;
};

// 创建/修改/删除表单赋值所需字段
const formDataProperties = (props: TToolsProps) => {
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
      description: "订单号，必填项，命名规则：[订单日期][订单排号]",
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
      type: "number",
      escription: "用户支付方式：必填项，值为value字段",
      enum: PayTypeOptions,
    },
    deliveryType: {
      type: "number",
      description: "配送方式：必填项，值为value字段",
      enum: DeliveryTypeOptions,
    },
    deliveryTime: {
      type: "number",
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

const create_form = (props?: any) => {
  return {
    type: "function",
    function: {
      name: FormAssignPageToolsEvents.Create_Form,
      description: "创建表单赋值数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [FormAssignPageToolsEvents.Create_Form],
          },
          data: {
            type: "object",
            description: "需要用到的数据",
            properties: {
              ...formDataProperties(props),
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

export const FormAssignPageToolsFunctions = {
  create_form,
} as const;
