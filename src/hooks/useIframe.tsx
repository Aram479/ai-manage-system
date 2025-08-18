// useIframeMessage.ts
import { useEffect, useRef, useState } from "react";

/**
 * iframe主页面使用的 hook，用于与 iframe 进行跨域通信
 */
const useIframeMessage = (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  targetOrigin: string,
  onMessage: IframeMessageHandler
) => {
  // 保存 onMessage 以便在事件中使用
  const handlerRef = useRef<IframeMessageHandler>(onMessage);
  const [loading, setLoading] = useState(true);

  const iframePageLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  // 监听来自 iframe 的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== targetOrigin) return;
      if (handlerRef.current) {
        handlerRef.current(event.data, event);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [targetOrigin]);

  // 页面是否加载完成
  useEffect(() => {
    const iframe = iframeRef.current;
    iframe?.addEventListener("load", iframePageLoad);

    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = "";
      }
      iframe?.removeEventListener("load", iframePageLoad);
    };
  }, []);

  // 发送消息给 iframe
  const sendMessage = (message: IframeMessageType) => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (iframeWindow) {
      iframeWindow.postMessage(message, targetOrigin);
    }
  };

  return { loading, sendMessage };
};

/**
 * iframe嵌套页面使用的 hook，用于监听主页面的消息
 */
const useParentMessage = (
  allowedOrigin: string,
  onMessage?: (data: IframeMessageType, event: MessageEvent) => void
) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== allowedOrigin) return;
      onMessage?.(event.data, event);
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

export { useIframeMessage, useParentMessage };
