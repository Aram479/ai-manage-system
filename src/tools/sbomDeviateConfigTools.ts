export enum SbomDeviateConfigToolsEvents {
  Search_Deviate = 'Search_Deviate',
  Export_Deviate = 'Export_Deviate',
}

/* 整合 结果类型 */
export type TSbomDeviateConfigTools = ExtractFunctionParameters<
  typeof SbomDeviateConfigToolsFunctions
>[keyof typeof SbomDeviateConfigToolsFunctions];

const eventProperties = (props: any) => {
  return {
    path: {
      type: 'string',
      description: '目标页面路径',
      enum: ['/SBOM/DeviateConfig'],
    },
  } as const;
};

const searchProperties = (props: any) => {
  return {
    soNumber: {
      type: 'array',
      items: {
        type: 'string',
        description: '命名规则：每个item项以SO开头拼接5位数字',
      },
    },
    smn: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    techConfig: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    parentNumber: {
      type: 'array',
      description: '偏离单号',
      items: {
        type: 'string',
      },
    },
    status: {
      type: 'integer',
      description: '状态: 未处理: 0，已处理：1',
      enum: [0, 1],
    },
    buildDate: {
      type: 'string',
      format: 'date',
      description: '创建时间 或者 构建时间 或者 Build date',
    },
    pageNumber: {
      type: 'integer',
      description: '当前页数，默认为1',
    },
    pageSize: {
      type: 'integer',
      description: '当前页条目数，默认10条',
    },
  } as const;
};

const search_Deviate = (props?: any) => {
  return {
    type: 'function',
    function: {
      name: SbomDeviateConfigToolsEvents.Search_Deviate,
      description: '跳转到SBOM偏离配置页面，并搜索或输入查询sbom偏离数据',
      parameters: {
        type: 'object',
        properties: {
          ...eventProperties(props),
          name: {
            type: 'string',
            description: '事件名称(必填)', // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [SbomDeviateConfigToolsEvents.Search_Deviate],
          },
          data: {
            type: 'object',
            description: '需要用到的数据',
            properties: {
              ...searchProperties(props),
            },
          },
        },
        required: ['name', 'path', 'tabKey', 'pageNumber', 'pageSize'],
      },
    },
  } as const;
};

const export_Deviate = (props?: any) => {
  return {
    type: 'function',
    function: {
      name: SbomDeviateConfigToolsEvents.Export_Deviate,
      description: '导出SBOM偏离配置表',
      parameters: {
        type: 'object',
        properties: {
          ...eventProperties(props),
          name: {
            type: 'string',
            description: '事件名称(必填)', // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [SbomDeviateConfigToolsEvents.Export_Deviate],
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
              ...searchProperties(props),
              fileName: {
                type: 'string',
                description:
                  '文件名称，命名规范：不同字段数据将以"-"拼接，同一字段多条数据以"、"拼接',
              },
            },
            required: ['pageNumber', 'pageSize'],
          },
        },
        required: ['name', 'toolType', 'data', 'pageNumber', 'pageSize'],
      },
    },
  } as const;
};

export const SbomDeviateConfigToolsFunctions = {
  search_Deviate,
  export_Deviate,
} as const;
