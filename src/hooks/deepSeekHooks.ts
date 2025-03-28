import { MutableRefObject, Ref, useCallback, useEffect, useRef } from "react";

export const useStreamController = () => {
  const streamController =
    useRef<TransformStreamDefaultController<string> | null>(null);

  const streamTest = useRef<TransformStream<string, string> | null>(null);
  const transformStream = () => {
    const newStream = new TransformStream<string, string>({
      transform(chunk, controller) {
        streamController.current = controller;
        controller.enqueue(chunk);
      },
    });
    streamTest.current = newStream;
    return newStream;
  };

  return {
    transformStream,
    controller: streamController.current,
    streamTest: streamTest.current,
  };
};
