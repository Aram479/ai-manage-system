import { useEffect } from "react";

/**
 * iframe嵌套页面使用的 hook，用于监听主页面的消息
 */
const useParentMessage = (
  allowedOrigin: string,
  onMessage: (data: IframeMessageType, event: MessageEvent) => void
) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== allowedOrigin) return;
      onMessage(event.data, event);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [allowedOrigin, onMessage]);

  // 向主页面发送消息
  const sendMessageToParent = (message: IframeMessageType) => {
    window.parent.postMessage(message, allowedOrigin);
  };

  return { sendMessageToParent };
};

export { useParentMessage };
