/* 事件集合 */
export enum ChartToolsEvents {
  Create_BarCharts = "Create_BarCharts",
  Create_PieCharts = "Create_PieCharts",
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
      description: "根据用户需求，生成柱状图数据",
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
            items: {
              type: "object",
              properties: {
                sales: {
                  type: "number",
                  description: "销售额",
                },
                type: {
                  type: "string",
                  description: "类型/类别，必填项",
                },
              },
              required: ["count", "type"],
            },
          },
        },
        required: ["name", "datas"],
      },
    },
  } as const;
};

const Create_PieCharts = (props: TToolsProps) => {
  return {
    type: "function",
    function: {
      name: ChartToolsEvents.Create_PieCharts,
      description: "根据用户需求，生成饼图数据",
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
            items: {
              type: "object",
              properties: {
                count: {
                  type: "number",
                  description: "数量，必填项",
                },
                type: {
                  type: "string",
                  description: "类型，必填项",
                },
              },
              required: ["count", "type"],
            },
          },
        },
        required: ["name", "path", "datas"],
      },
    },
  } as const;
};

export const ChartToolsFunctions = {
  Create_BarCharts,
  Create_PieCharts,
} as const;
