export enum BaseToolsEvents {
  Navigate_Page = 'Navigate_Page',
  Update_System_Title = 'Update_System_Title',
}

/* 整合 结果类型 */
export type TBaseTools = ExtractFunctionParameters<
  typeof BaseToolsFunctions
>[keyof typeof BaseToolsFunctions];

const eventProperties = (props: any) => {
  const { userMenus } = props;

  return {
    path: {
      type: 'string',
      description: '目标页面路径',
      enum: userMenus,
    },
  } as const;
};

const navigate_page = (props?: any) => {
  return {
    type: 'function',
    function: {
      name: BaseToolsEvents.Navigate_Page,
      description: '跳转到指定系统页面',
      parameters: {
        type: 'object',
        properties: {
          ...eventProperties(props),
          name: {
            type: 'string',
            description: '事件名称', // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [BaseToolsEvents.Navigate_Page],
          },
        },
        required: ['name', 'path'],
      },
    },
  } as const;
};

const update_system_title = (props?: any) => {
  return {
    type: 'function',
    function: {
      name: BaseToolsEvents.Update_System_Title,
      description: '根据html+css语言，修改当前系统名称/系统标题或者样式',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '事件名称', // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [BaseToolsEvents.Update_System_Title],
          },
          title: {
            type: 'string',
            description: '根据html+css语言，美化系统名称/系统标题',
            enum: ['EBU Service Engineering Digital Platform'],
          },
        },
        required: ['name', 'title'],
      },
    },
  } as const;
};

export const BaseToolsFunctions = {
  navigate_page,
  update_system_title,
} as const;
