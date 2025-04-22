import { TGlobalToolsEvent } from "@/tools";
import { useChatEvent } from "./useChatEvent";
import { UserManageToolsEvents } from "@/tools/userManageTools";
import {
  exportOrderListApi,
  exportUserListApi,
} from "@/request/exportRequestApi";
import { OrderManageToolsEvents } from "@/tools/orderManageTools";

export const useGlobalChatEvent = () => {
  const exportUserListReq = exportUserListApi();
  const exportOrderListReq = exportOrderListApi();
  useChatEvent<TGlobalToolsEvent>((event) => {
    if (event.name === UserManageToolsEvents.Export_UserList) {
      exportUserListReq.run();
    } else if (event.name === OrderManageToolsEvents.Export_OrderList) {
      exportOrderListReq.run();
    }
    // if (event.name === SbomDeviateConfigToolsEvents.Export_Deviate) {
    //   const chatDataReqData = event.data;
    //   if (chatDataReqData) {
    //     // exportSBOMDevReq.run({
    //     //   ...chatDataReqData,
    //     //   buildDate: dayjs(chatDataReqData.buildDate).toISOString(),
    //     // } as any);
    //   }
    // }
  });
};
