import { Message } from "@/pages/ChatRoom/types";
import { useCallback, useRef } from "react";
import Logo from "@/../public/favicon.ico";

export const useNotification = (delay: number = 1000) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const notify = useCallback(
    (message: Message): void => {
      // 清除上一次的定时器（实现防抖）
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        // 检查是否在浏览器环境中且支持 Notification API
        if (typeof window === "undefined" || !("Notification" in window)) {
          console.warn(
            "[useNotification] 当前环境不支持浏览器通知（Notification API）"
          );
          return;
        }

        try {
          let permission = Notification.permission;
          const NotificationConfig = {
            body: "您有新的未读消息，请及时处理", // 消息内容
            // silent: true, //	静音浏览器通知声，本例使用了自定义通知声。
            // requireInteraction: true, // 设置手动关闭
            // tag: "ChatRoom", // 通知ID，同类通知建议设置相同ID，避免通知过多遮挡桌面
            icon: Logo, // 通知图标
          };
          if (permission === "granted") {
            new Notification("Veloce新消息", NotificationConfig);
          } else if (permission !== "denied") {
            permission = await Notification.requestPermission();
            if (permission === "granted") {
              new Notification("Veloce新消息", NotificationConfig);
            } else if (permission === "denied") {
              console.warn("[useNotification] 用户拒绝了通知权限");
            }
          } else {
            console.warn(
              "[useNotification] 通知权限已被拒绝，请在浏览器设置中手动启用"
            );
          }
        } catch (error) {
          console.error("[useNotification] 显示通知时发生错误:", error);
        }
      }, delay);
    },
    [delay]
  );

  // 可选：在组件卸载时清理定时器（更严谨）
  // 注意：React 本身不会自动清理 setTimeout，但此处由用户调用控制，通常影响不大。
  // 若需严格清理，可返回 cleanup 函数，但会破坏简洁性。此处权衡后暂不暴露。

  return { notify };
};
