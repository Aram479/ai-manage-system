import { useEffect } from "react";
import { message } from "antd";
import { history, useModel } from "@umijs/max";

type TCallbackEvent = {
  [key: string]: any;
  event?: string;
};
type TUseChatEvent = (eventInfo: TCallbackEvent) => void;

export const useChatEvent = (callback: TUseChatEvent) => {
  const { events } = useModel("chat");

  // 执行分发器
  const handleCommandExecutor = () => {
    if (events.length) {
      events.forEach((item) => {
        callback?.(item);
      });
    }
  };

  useEffect(() => {
    handleCommandExecutor();
  }, [events]);
};
