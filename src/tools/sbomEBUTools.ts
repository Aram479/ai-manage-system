export enum SbomEBUToolsEvents {
  Search_Engine = 'Search_Engine',
  Search_After = 'Search_After',
  Batch_Export = 'Batch_Export',
}

/* 整合 结果类型 */
export type TSbomEBUTools = ExtractFunctionParameters<
  typeof SbomEBUToolsFunctions
>[keyof typeof SbomEBUToolsFunctions];

const eventProperties = (props: any) => {
  return {
    path: {
      type: 'string',
      description: '目标页面路径',
      enum: ['/SBOM/SBOMQueryEBU'],
    },
  } as const;
};

const searchProperties = (props: any) => {
  return {
    tabKey: {
      type: 'string',
      description: '目标页签(tab)key值',
      enum: ['Engine', 'Aftertreatment'],
    },
    esn: {
      type: 'string',
      description: '8位数字',
    },
    plant: {
      type: 'string',
      description: 'JV/Plant 或者 plant，如果esn有值则不需要此字段',
      enum: ['DCEC', 'CCEC', 'XCEC'],
    },
    soNumber: {
      type: 'string',
      description: '命名规范：SO[5位数字]，以SO开头拼接5位数字，如果esn有值则不需要此字段',
    },
    buildDate: {
      type: 'string',
      format: 'date',
      description: '创建时间 或者 构建时间 或者 Build date，如果esn有值则不需要此字段',
    },
  } as const;
};

const search_Engine = (props?: any) => {
  return {
    type: 'function',
    function: {
      name: SbomEBUToolsEvents.Search_Engine,
      description: '跳转到SBOM查询-EBU页面的发动机页签或者发动机页面，并搜索或输入查询数据',
      parameters: {
        type: 'object',
        properties: {
          ...eventProperties(props),
          name: {
            type: 'string',
            description: '事件名称(必填)', // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [SbomEBUToolsEvents.Search_Engine],
          },
          data: {
            type: 'object',
            description: '需要用到的数据',
            properties: {
              ...searchProperties(props),
            },
          },
        },
        required: ['name', 'path', 'tabKey'],
      },
    },
  } as const;
};

const search_After = (props?: any) => {
  return {
    type: 'function',
    function: {
      name: SbomEBUToolsEvents.Search_After,
      description: '跳转到SBOM查询-EBU页面的后处理页签或者后处理页面，并搜索或输入查询数据',
      parameters: {
        type: 'object',
        properties: {
          ...eventProperties(props),
          name: {
            type: 'string',
            description: '事件名称(必填)', // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [SbomEBUToolsEvents.Search_After],
          },
          data: {
            type: 'object',
            description: '需要用到的数据',
            properties: {
              ...searchProperties(props),
            },
          },
        },
        required: ['name', 'path', 'tabKey'],
      },
    },
  } as const;
};

const batch_Export = (props?: any) => {
  return {
    type: 'function',
    function: {
      name: SbomEBUToolsEvents.Batch_Export,
      description: '批量导出SBOM-EBU数据',
      parameters: {
        type: 'object',
        properties: {
          ...eventProperties(props),
          name: {
            type: 'string',
            description: '事件名称(必填)', // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [SbomEBUToolsEvents.Batch_Export],
          },
          toolType: {
            type: 'string',
            description: '工具类型，api：调用接口',
            enum: ['api'],
          },
          data: {
            type: 'object',
            description: '需要用到的数据',
            properties: {
              soNumbers: {
                type: 'array',
                items: {
                  type: 'string',
                  description: '命名规则：每个item项以SO开头拼接5位数字',
                },
              },
              plant: {
                type: 'string',
                description: 'JV/Plant 或者 plant',
                enum: ['DCEC', 'CCEC', 'XCEC'],
              },
              buildDate: {
                type: 'string',
                format: 'date',
                description: '创建时间 或者 构建时间 或者 Build date',
              },
              fileName: {
                type: 'string',
                description:
                  '文件名称，命名规范：不同字段数据将以"_"拼接，同一字段多条数据以"、"拼接',
              },
            },
            required: ['soNumbers', 'plant', 'buildDate'],
          },
        },
        required: ['name', 'toolType', 'data'],
      },
    },
  } as const;
};

export const SbomEBUToolsFunctions = {
  search_Engine,
  search_After,
  batch_Export,
} as const;
