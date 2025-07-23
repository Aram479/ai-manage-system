import { RoleOptions } from "@/constant/options";

/* 事件集合 */
export enum RoleManageToolsEvents {
  Search_Role = "Search_Role",
  Export_RoleList = "Export_RoleList",
}

/* 整合 结果类型 */
export type TRoleManageTools = ExtractFunctionParameters<
  typeof RoleManageToolsFunctions
>[keyof typeof RoleManageToolsFunctions];

// 事件统一字段
const eventProperties = (props: TToolsProps) => {
  return {
    path: {
      type: "string",
      description: "目标页面路径",
      enum: ["/RoleManage"],
    },
  } as const;
};

// 搜索字段
const searchProperties = (props: TToolsProps) => {
  return {
    role: {
      type: "string",
      description: "用户角色：必填项",
      enum: RoleOptions.map(item=> item.value),
    },
    createTime: {
      type: "string",
      format: "date",
      description: "创建时间 或者 构建时间 或者 Build date",
    },
  } as const;
};

const search_role = (props?: any) => {
  return {
    type: "function",
    function: {
      name: RoleManageToolsEvents.Search_Role,
      description: "搜索角色数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [RoleManageToolsEvents.Search_Role],
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
            required: [],
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

const export_roleList = (props?: any) => {
  return {
    type: "function",
    function: {
      name: RoleManageToolsEvents.Export_RoleList,
      description: "导出角色数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [RoleManageToolsEvents.Export_RoleList],
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

export const RoleManageToolsFunctions = {
  search_role,
  export_roleList,
} as const;
