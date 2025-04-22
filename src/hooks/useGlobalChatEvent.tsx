import { TGlobalToolsEvent } from "@/tools";
import { useChatEvent } from "./useChatEvent";
import { UserManageToolsEvents } from "@/tools/userManageTools";
import {
  exportOrderListApi,
  exportRoleListApi,
  exportUserListApi,
} from "@/request/exportRequestApi";
import { OrderManageToolsEvents } from "@/tools/orderManageTools";
import { RoleManageToolsEvents } from "@/tools/roleManageTools";

export const useGlobalChatEvent = () => {
  const exportUserListReq = exportUserListApi();
  const exportOrderListReq = exportOrderListApi();
  const exportRoleListReq = exportRoleListApi();
  useChatEvent<TGlobalToolsEvent>((event) => {
    if (event.name === UserManageToolsEvents.Export_UserList) {
      exportUserListReq.run();
    } else if (event.name === OrderManageToolsEvents.Export_OrderList) {
      exportOrderListReq.run();
    } else if (event.name === RoleManageToolsEvents.Export_RoleList) {
      exportRoleListReq.run();
    }
  });
};
