/* 事件集合 */
export enum MainToolsEvents {
  Create_Component = "Create_Component",
}

/* 整合 结果类型 */
export type TMainTools = ExtractFunctionParameters<
  typeof MainToolsFunctions
>[keyof typeof MainToolsFunctions];

// 事件统一字段
const eventProperties = (props: TToolsProps) => {
  return {
    path: {
      type: "string",
      description: "目标页面路径",
      enum: ["/Main"],
    },
  } as const;
};

const create_component = (props: TToolsProps) => {
  return {
    type: "function",
    function: {
      name: MainToolsEvents.Create_Component,
      description:
        "根据React+html+css语言，实现某个功能，不可使用javascript代码",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [MainToolsEvents.Create_Component],
          },
          style: {
            type: "string",
            description: "style：必填项，style标签，样式模仿antd的css样式",
          },
          html: {
            type: "string",
            description: "html：必填项，模仿antd的html布局",
          },
        },
        required: ["name", "style", "html"],
      },
    },
  } as const;
};

export const MainToolsFunctions = {
  create_component,
} as const;
