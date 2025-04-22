/* 事件集合 */
export enum MenuToolsEvents {
  Create_Menu = 'Create_Menu',
}

/* 整合 结果类型 */
export type TMenuTools = ExtractFunctionParameters<
  typeof MenuToolsFunctions
>[keyof typeof MenuToolsFunctions];

const eventProperties = (props: TToolsProps) => {
  return {
    path: {
      type: 'string',
      description: '目标页面路径',
      enum: ['/Sys/Setting/Permission/MenuManage'],
    },
  } as const;
};

const menuProperties = (props: TToolsProps) => {
  console.log(props);
  const { userMenus } = props;
  return {
    name: {
      type: 'object',
      properties: {
        'zh-CN': {
          type: 'string',
          description: '中文名称',
        },
        'en-US': {
          type: 'string',
          description: '英文名称',
        },
      },
      required: ['zh-CN', 'en-US'],
    },
    parentId: {
      type: 'string',
      description: '如果在某个父级菜单下新增则parentId必填，parentId字段对应父级菜单中的pmsCode',
      enum: userMenus,
    },
    desc: {
      type: 'string',
      description: '菜单描述',
    },
    key: {
      type: 'string',
      description: '系统目标路径',
    },
    isEnabled: {
      type: 'boolean',
      description: '是否启用菜单',
    },
  } as const;
};

const create_Menu = (props?: any) => {
  return {
    type: 'function',
    function: {
      name: MenuToolsEvents.Create_Menu,
      description: '新增菜单数据',
      parameters: {
        type: 'object',
        properties: {
          ...eventProperties(props),
          name: {
            type: 'string',
            description: '事件名称(必填)', // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [MenuToolsEvents.Create_Menu],
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
              ...menuProperties(props),
            },
            required: ['name'],
          },
        },
        required: ['name', 'toolType', 'data'],
      },
    },
  } as const;
};

export const MenuToolsFunctions = {
  create_Menu,
} as const;
