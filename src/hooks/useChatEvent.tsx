import { useEffect } from "react";
import { useModel } from "@umijs/max";

type TCallbackEvent = {
  [key: string]: any;
  event?: string;
};
type TUseChatEvent<T = TCallbackEvent> = (eventInfo: T) => void;

export const useChatEvent = <T = any>(callback: TUseChatEvent<T>) => {
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
