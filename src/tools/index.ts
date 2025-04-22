import { BaseToolsFunctions, TBaseTools } from "./baseTools";
import {
  OrderManageToolsFunctions,
  TOrderManageTools,
} from "./orderManageTools";
import { RoleManageToolsFunctions, TRoleManageTools } from "./roleManageTools";
import { TUserManageTools, UserManageToolsFunctions } from "./userManageTools";

export type TGlobalToolsEvent =
  | TBaseTools
  | TUserManageTools
  | TOrderManageTools
  | TRoleManageTools;

// 合并所有工具函数集合
const allToolsFunctions = {
  ...BaseToolsFunctions,
  ...UserManageToolsFunctions,
  ...OrderManageToolsFunctions,
  ...RoleManageToolsFunctions,
};

// 动态调用所有工具函数
export const allTools = (props: TToolsProps) => {
  return Object.values(allToolsFunctions).map((func) => func(props));
};
