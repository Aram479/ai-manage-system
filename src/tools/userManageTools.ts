import { RoleOptions } from "@/constant/options";

/* 事件集合 */
export enum UserManageToolsEvents {
  Search_User = "Search_User",
  Create_User = "Create_User",
  Edit_User = "Edit_User",
  Delete_User = "Delete_User",
  Export_UserList = "Export_UserList",
}

/* 整合 结果类型 */
export type TUserManageTools = ExtractFunctionParameters<
  typeof UserManageToolsFunctions
>[keyof typeof UserManageToolsFunctions];

// 事件统一字段
const eventProperties = (props: TToolsProps) => {
  return {
    path: {
      type: "string",
      description: "目标页面路径",
      enum: ["/UserManage"],
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
    role: {
      type: "string",
      description: "用户角色，值为某项的value",
      enum: RoleOptions,
    },
    createTime: {
      type: "string",
      format: "date",
      description:
        "创建时间 或者 构建时间 或者 Build date: 格式为YYYY-MM-DD hh:mm:ss",
    },
  } as const;
};
// 创建/修改/删除用户所需字段
const userDataProperties = (props: TToolsProps) => {
  const { userList } = props;

  return {
    id: {
      type: "string",
      description:
        "用户唯一标识(ID): 数字或字符串类型，创建用户不需要id字段，修改用户时根据用户名称获取对应字段值",
      enum: userList,
    },
    userName: {
      type: "string",
      description: "用户名称",
    },
    role: {
      type: "string",
      description: "用户角色，值为某项的value, 根据用户名称获取对应此字段值",
      enum: RoleOptions,
    },
    phone: {
      type: "number",
      description: "用户手机号, 根据用户名称获取对应此字段值",
    },
    status: {
      type: "number",
      description:
        "用户状态: 主要用于是否启用/禁用用户, 默认为0(禁用), 根据用户名称获取对应此字段值",
    },
    createTime: {
      type: "string",
      format: "date",
      description:
        "用户创建时间，根据用户名称获取对应此字段值: 格式为YYYY-MM-DD hh:mm:ss",
      enum: userList,
    },
  } as const;
};

const search_user = (props?: any) => {
  return {
    type: "function",
    function: {
      name: UserManageToolsEvents.Search_User,
      description: "查询用户列表",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [UserManageToolsEvents.Search_User],
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
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

const export_userList = (props?: any) => {
  return {
    type: "function",
    function: {
      name: UserManageToolsEvents.Export_UserList,
      description: "导出用户数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [UserManageToolsEvents.Export_UserList],
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

const create_user = (props?: any) => {
  return {
    type: "function",
    function: {
      name: UserManageToolsEvents.Create_User,
      description: "创建用户数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [UserManageToolsEvents.Create_User],
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
              ...userDataProperties(props),
            },
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

const edit_user = (props?: any) => {
  return {
    type: "function",
    function: {
      name: UserManageToolsEvents.Edit_User,
      description: "修改用户数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [UserManageToolsEvents.Edit_User],
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
              ...userDataProperties(props),
            },
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

const delete_user = (props?: any) => {
  return {
    type: "function",
    function: {
      name: UserManageToolsEvents.Delete_User,
      description: "删除用户数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [UserManageToolsEvents.Delete_User],
          },
          data: {
            type: "object",
            description: "需要用到的数据",
            properties: {
              ...userDataProperties(props),
            },
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

export const UserManageToolsFunctions = {
  create_user,
  search_user,
  edit_user,
  delete_user,
  export_userList,
} as const;
