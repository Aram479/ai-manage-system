import { RoleOptions } from "@/constant/options";

/* 事件集合 */
export enum UserManageToolsEvents {
  Search_User = "Search_User",
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
    role: {
      type: "string",
      description: "用户角色，值为某项的value",
      enum: RoleOptions,
    },
    user: {
      type: "string",
      description: "用户名称",
    },
    createTime: {
      type: "string",
      format: "date",
      description: "创建时间 或者 构建时间 或者 Build date",
    },
  } as const;
};

const search_user = (props?: any) => {
  return {
    type: "function",
    function: {
      name: UserManageToolsEvents.Search_User,
      description: "搜索用户数据",
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
            description: "工具类型，api：调用接口",
            enum: ["api"],
          },
        },
        required: ["name"],
      },
    },
  } as const;
};

export const UserManageToolsFunctions = {
  search_user,
  export_userList,
} as const;
