import { useRef, useState } from "react";
import { history } from "@umijs/max";
import { message } from "antd";
import { UploadFile } from "antd/lib";
import { FileObject } from "openai/resource.mjs";

const chat = () => {
  // 存储指令事件数据
  const [contentEvent, setContentEvent] = useState<any>({});
  const [events, setEvents] = useState<any[]>([]);
  const [toolEvent, setToolEvent] = useState<any>({});
  const chatUploadFiles = useRef<UploadFile<FileObject>[]>([]);
  /* stream流中使用ref */
  const eventList = useRef<any[]>([]);

  const setContentCommandExecutor = (
    chatString?: string,
    isComplete?: boolean
  ) => {
    setContentEvent({
      value: chatString,
      isComplete,
    });
  };
  const setCommandExecutor = (chatCommandJson?: string) => {
    try {
      if (chatCommandJson) {
        // 将多个 JSON 对象分割为独立的 JSON 字符串
        const jsonStrings = chatCommandJson.split(/(?<=\})\s*(?=\{)/);
        // 查找该事件列表中是否已存在 并找出其index
        const newEvents = jsonStrings.map((item) => JSON.parse(item));
        setEvents(newEvents);
        jsonStrings.forEach((jsonItem) => {
          const includeEventItem = eventList.current.find(
            (eventItem) => eventItem.jsonString == jsonItem
          );
          if (includeEventItem) {
            exCMDAction(includeEventItem);
            includeEventItem.exNumber += 1;
          } else {
            // 解析每个新的 JSON 字符串并存入数组
            const command = JSON.parse(jsonItem);
            const newEventItem = {
              ...command,
              jsonString: jsonItem,
              exNumber: 1,
            };
            eventList.current = [...eventList.current, newEventItem];
            // 在model中提前处理某些tool事件
            exCMDAction(command);
          }
        });
      }
    } catch (error) {
      message.error("命令错误，请重试！");
    }
  };

  // 实时更新对话中返回的格式化数据
  const setToolCommandExecutor = (chatJson?: string, isComplete?: boolean) => {
    try {
      if (chatJson) {
        const newData = JSON.parse(chatJson);
        setToolEvent({
          ...newData,
          isComplete,
        });
      }
    } catch (error) {}
  };

  // 执行命令操作
  const exCMDAction = (command: any) => {
    if (command.path && command.toolType !== "api") {
      // history.push(item.path);
      history.push(command.path, command.state);
    }
  };

  return {
    events,
    eventList,
    toolEvent,
    contentEvent,
    chatUploadFiles,
    setContentCommandExecutor,
    setCommandExecutor,
    setToolCommandExecutor,
    setEvents,
    setToolEvent,
  };
};

export default chat;
