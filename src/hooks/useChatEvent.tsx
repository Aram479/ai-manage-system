import { useEffect } from "react";
import { useModel } from "@umijs/max";

type TCallbackEvent = {
  [key: string]: any;
  event?: string;
};
type TUseChatEvent<T = TCallbackEvent> = (eventInfo: T) => void;

export const useChatEvent = <T = any,>(callback: TUseChatEvent<T>) => {
  const { events, setEvents } = useModel("chat");

  // 执行分发器
  const handleCommandExecutor = () => {
    if (events.length) {
      // 执行指令
      events.forEach((item) => {
        callback?.(item);
      });
      // 指令执行完毕后清空指令
      setEvents([]);
    }
  };

  useEffect(() => {
    handleCommandExecutor();
  }, [events]);
};
