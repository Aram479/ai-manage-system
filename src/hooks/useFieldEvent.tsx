import { useEffect } from "react";
import { useModel } from "@umijs/max";

type TCallbackEvent = {
  [key: string]: any;
  event?: string;
};
type TUseFieldEvent<T = TCallbackEvent> = (
  eventInfo: T,
  isComplete: boolean
) => void;

// Stream流执行时多次触发，该Hook是用于实现AI实时进行字段赋值时
export const useFieldEvent = <T = any,>(callback: TUseFieldEvent<T>) => {
  const { toolEvent } = useModel("chat");

  // 执行分发器
  const handleCommandExecutor = () => {
    if (toolEvent) {
      // 执行指令
      callback?.(toolEvent, toolEvent.isComplete);
    }
  };

  useEffect(() => {
    if (Object.keys(toolEvent || {}).length) {
      handleCommandExecutor();
    }
  }, [toolEvent]);
};
