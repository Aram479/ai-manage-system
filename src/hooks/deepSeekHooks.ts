import { useRef } from "react";

export const useStreamController = () => {
  const streamController =
    useRef<TransformStreamDefaultController | null>(null);

  const streamClass = useRef<TransformStream | null>(null);

  // 注意：这里任何useState和其他异步数据都只能获取初始值，无法获取set之后的数据，请使用useRef
  const transformStream = () => {
    const newStream = new TransformStream({
      transform(chunk, controller) {
        streamController.current = controller;
        controller.enqueue(chunk);
      },
    });
    streamClass.current = newStream;
    return newStream;
  };

  return {
    transformStream,
    controller: streamController.current,
    streamClass: streamClass.current,
  };
};
