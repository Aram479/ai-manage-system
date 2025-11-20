// hooks/useSocket.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

type SocketEvent = string | symbol;

interface UseSocketOptions {
  /** 是否自动连接，默认 true */
  autoConnect?: boolean;
  /** 连接选项，透传给 socket.io-client */
  connectionOptions?: object;
}

/**
 * 封装 socket.io-client 的自定义 Hook
 */
export const useSocket = (url: string, options: UseSocketOptions = {}) => {
  const { autoConnect = true, connectionOptions = {} } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState<string>("");

  const socketRef = useRef<Socket | null>(null);

  // 初始化连接
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(url, {
      ...connectionOptions,
      // transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      console.log("Socket已连接:", socket.id);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket 未连接");
    });

    socket.on("connect_error", (err) => {
      console.log("Socket 连接错误");
    });

    socketRef.current = socket;
  }, [url, JSON.stringify(connectionOptions)]);

  // 断开连接
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      setIsConnected(false);
    }
  }, []);

  // 重新连接
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  // 自动连接控制
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // 发送事件
  const emit = useCallback((event: SocketEvent, ...args: any[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event as any, ...args);
    } else {
      console.warn("Socket not connected. Cannot emit event:", event);
    }
  }, []);

  // 监听事件（推荐在组件内使用，避免闭包问题）
  const on = useCallback(
    (event: SocketEvent, listener: (...args: any[]) => void) => {
      if (socketRef.current) {
        socketRef.current.on(event as any, listener);
      }
      // 返回取消监听函数
      return () => {
        if (socketRef.current) {
          socketRef.current.off(event as any, listener);
        }
      };
    },
    []
  );

  return {
    socket: socketRef.current,
    isConnected,
    transport,
    emit,
    on,
    connect,
    disconnect,
    reconnect,
  };
};
