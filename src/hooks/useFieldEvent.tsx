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
  const { fieldEvent, setFieldEvent } = useModel("chat");

  // 执行分发器
  const handleCommandExecutor = () => {
    if (fieldEvent) {
      // 执行指令
      callback?.(fieldEvent, fieldEvent.isComplete);
    }
  };

  useEffect(() => {
    if (Object.keys(fieldEvent || {}).length) {
      handleCommandExecutor();
    }
  }, [fieldEvent]);
};
