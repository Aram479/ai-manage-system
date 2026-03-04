/* 事件集合 */
export enum ChartToolsEvents {
  Create_BarCharts = "Create_BarCharts",
  Create_PieCharts = "Create_PieCharts",
  Create_LineCharts = "Create_LineCharts",
  Create_WaterfallCharts = "Create_WaterfallCharts",
  Create_StockCharts = "Create_StockCharts",
  Update_BarCharts = "Update_BarCharts",
  Update_PieCharts = "Update_PieCharts",
  Update_LineCharts = "Update_LineCharts",
  Update_WaterfallCharts = "Update_WaterfallCharts",
  Update_StockCharts = "Update_StockCharts",
}

/* 整合 结果类型 */
export type TChartTools = ExtractFunctionParameters<
  typeof ChartToolsFunctions
>[keyof typeof ChartToolsFunctions];

// 事件统一字段
const eventProperties = (props: TToolsProps) => {
  return {
    path: {
      type: "string",
      description: "目标页面路径",
      enum: ["/Charts"],
    },
  } as const;
};

const Create_BarCharts = (props: TToolsProps) => {
  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Create_BarCharts,
      description: "根据用户需求，生成柱状图",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Create_BarCharts],
          },
          datas: {
            type: "array",
            description: "图表数据，必填项",
          },
          config: {
            type: "object",
            description:
              "配置项，必填项：根据ant design charts版本为1.4.2为标准的柱状图的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/column，但配置项中不需要data字段",
          },
        },
        required: ["name", "datas", "config"],
      },
    },
  } as const;
};

const Create_PieCharts = (props: TToolsProps) => {
  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Create_PieCharts,
      description: "根据用户需求，生成饼图",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Create_PieCharts],
          },
          datas: {
            type: "array",
            description: "图表数据，必填项",
          },
          config: {
            type: "object",
            description:
              "配置项，必填项：根据ant design charts版本为1.4.2为标准的饼图的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/pie，但配置项中不需要data字段",
          },
        },
        required: ["name", "path", "datas", "config"],
      },
    },
  } as const;
};

const Create_LineCharts = (props: TToolsProps) => {
  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Create_LineCharts,
      description: "根据用户需求，生成折线图数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Create_LineCharts],
          },
          datas: {
            type: "array",
            description: "图表数据，必填项",
          },
          config: {
            type: "object",
            description:
              "必填项，根据ant design charts版本为1.4.2为标准的瀑布图的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/line，但配置项中不需要data字段",
          },
        },
        required: ["name", "path", "datas", "config"],
      },
    },
  } as const;
};

const Create_WaterfallCharts = (props: TToolsProps) => {
  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Create_WaterfallCharts,
      description: "根据用户需求，生成瀑布图数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Create_WaterfallCharts],
          },
          datas: {
            type: "array",
            description: "图表数据，必填项",
          },
          config: {
            type: "object",
            description:
              "必填项，根据ant design charts版本为1.4.2为标准的瀑布图的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/waterfall，但配置项中不需要data字段",
          },
        },
        required: ["name", "path", "datas", "config"],
      },
    },
  } as const;
};

const Create_StockCharts = (props: TToolsProps) => {
  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Create_StockCharts,
      description: "根据用户需求，生成股票图数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Create_StockCharts],
          },
          datas: {
            type: "array",
            description: "图表数据，必填项",
          },
          config: {
            type: "object",
            description:
              "必填项，根据ant design charts版本为1.4.2为标准的股票图的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/stock，但配置项中不需要data字段",
          },
        },
        required: ["name", "path", "datas", "config"],
      },
    },
  } as const;
};

const Update_BarCharts = (props: TToolsProps) => {
  const { chartConfig } = props;

  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Update_LineCharts,
      description:
        "根据用户需求，修改柱状图数据，数据的返回格式要严格按照JSON数据格式规范完整提供，不得有缺漏字符",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Update_LineCharts],
          },
          datas: {
            type: "array",
            description:
              "图表数据，必填项，如果用户需要修改datas数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.data,
          },
          config: {
            type: "object",
            description:
              "必填项，根据ant design charts版本为1.4.2为标准的瀑布图的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/line，但配置项中不需要data字段，如果用户需要修改config数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.config,
          },
        },
        required: ["name", "datas", "config"],
      },
    },
  } as const;
};

const Update_PieCharts = (props: TToolsProps) => {
  const { chartConfig } = props;

  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Update_PieCharts,
      description:
        "根据用户需求，修改饼图数据，数据的返回格式要严格按照JSON数据格式规范完整提供，不得有缺漏字符",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Update_PieCharts],
          },
          datas: {
            type: "array",
            description:
              "图表数据，必填项，如果用户需要修改datas数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.data,
          },
          config: {
            type: "object",
            description:
              "必填项，根据ant design charts版本为1.4.2为标准的图表的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/line，但配置项中不需要data字段，如果用户需要修改config数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.config,
          },
        },
        required: ["name", "datas", "config"],
      },
    },
  } as const;
};

const Update_LineCharts = (props: TToolsProps) => {
  const { chartConfig } = props;

  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Update_LineCharts,
      description:
        "根据用户需求，修改折线图数据，数据的返回格式要严格按照JSON数据格式规范完整提供，不得有缺漏字符",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Update_LineCharts],
          },
          datas: {
            type: "array",
            description:
              "图表数据，必填项，如果用户需要修改datas数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.data,
          },
          config: {
            type: "object",
            description:
              "必填项，根据ant design charts版本为1.4.2为标准的图表的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/line，但配置项中不需要data字段，如果用户需要修改config数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.config,
          },
        },
        required: ["name", "datas", "config"],
      },
    },
  } as const;
};

const Update_WaterfallCharts = (props: TToolsProps) => {
  const { chartConfig } = props;

  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Update_WaterfallCharts,
      description:
        "根据用户需求，修改瀑布图数据，数据的返回格式要严格按照JSON数据格式规范完整提供，不得有缺漏字符",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Update_WaterfallCharts],
          },
          datas: {
            type: "array",
            description:
              "图表数据，必填项，如果用户需要修改datas数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.data,
          },
          config: {
            type: "object",
            description:
              "必填项，根据ant design charts版本为1.4.2为标准的图表的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/line，但配置项中不需要data字段，如果用户需要修改config数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.config,
          },
        },
        required: ["name", "datas", "config"],
      },
    },
  } as const;
};

const Update_StockCharts = (props: TToolsProps) => {
  const { chartConfig } = props;

  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Update_StockCharts,
      description:
        "根据用户需求，修改股票图数据，数据的返回格式要严格按照JSON数据格式规范完整提供，不得有缺漏字符",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称",
            enum: [ChartToolsEvents.Update_StockCharts],
          },
          datas: {
            type: "array",
            description:
              "图表数据，必填项，如果用户需要修改datas数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.data,
          },
          config: {
            type: "object",
            description:
              "必填项，根据ant design charts版本为1.4.2为标准的图表的配置项，文档链接：https://ant-design-charts-v1.antgroup.com/api/plots/line，但配置项中不需要data字段，如果用户需要修改config数据但没有明确提供该数据，则默认基于默认值数据进行修改",
            default: chartConfig?.config,
          },
        },
        required: ["name", "datas", "config"],
      },
    },
  } as const;
};

export const ChartToolsFunctions = {
  Create_BarCharts,
  Create_PieCharts,
  Create_LineCharts,
  Create_WaterfallCharts,
  Create_StockCharts,
  Update_BarCharts,
  Update_PieCharts,
  Update_LineCharts,
  Update_WaterfallCharts,
  Update_StockCharts,
} as const;
