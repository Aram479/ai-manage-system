import dayjs from 'dayjs';
import { TGlobalToolsEvent } from '@/tools';
import { MenuToolsEvents } from '@/tools/menuTools';
import { SbomDeviateConfigToolsEvents } from '@/tools/sbomDeviateConfigTools';
import { SbomEBUToolsEvents } from '@/tools/sbomEBUTools';
import { useChatEvent } from './useChatEvent';

export const useGlobalChatEvent = () => {

  useChatEvent<TGlobalToolsEvent>((event) => {
    if (event.name === SbomDeviateConfigToolsEvents.Export_Deviate) {
      const chatDataReqData = event.data;
      if (chatDataReqData) {
        // exportSBOMDevReq.run({
        //   ...chatDataReqData,
        //   buildDate: dayjs(chatDataReqData.buildDate).toISOString(),
        // } as any);
      }
    } else if (event.name === SbomEBUToolsEvents.Batch_Export) {
      const chatDataReqData = event.data;
      if (chatDataReqData) {
        // sbomExportBatchReq.run({
        //   ...chatDataReqData,
        //   buildDate: dayjs(chatDataReqData.buildDate).toISOString(),
        // } as any);
      }
    } else if (event.name === MenuToolsEvents.Create_Menu) {
      const chatDataReqData = event.data;
      if (chatDataReqData) {
        console.log('菜单数据', chatDataReqData);
        // addMenuReq.run(chatDataReqData)
      }
    }
  });
};
