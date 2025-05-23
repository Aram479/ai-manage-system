import { useRef, useState } from 'react';
import { history } from '@umijs/max';
import { message } from 'antd';
import { UploadFile } from 'antd/lib';
import { FileObject } from 'openai/resource.mjs';

const chat = () => {
  // 存储指令事件数据
  const [events, setEvents] = useState<any[]>([]);
  // stream流中使用ref
  const chatUploadFiles = useRef<UploadFile<FileObject>[]>([]);
  const setCommandExecutor = (chatCommandJson?: string) => {
    try {
      if (chatCommandJson) {
        console.log('chatCommandJson', chatCommandJson)
        // 将多个 JSON 对象分割为独立的 JSON 字符串
        const jsonStrings = chatCommandJson.split(/(?<=\})\s*(?=\{)/);
        // 解析每个 JSON 字符串并存入数组
        const commands = jsonStrings.map((jsonString) => JSON.parse(jsonString));
        setEvents(commands);
        // 在model中提前处理某些tool事件
        if (commands.length) {
          commands.forEach((item) => {
            if (item.path && item.toolType !== 'api') {
              // history.push(item.path);
              history.push(item.path, item.state);
            }
          });
        }
      }
    } catch (error) {
      message.error('命令错误，请重试1！');
    }
  };
  return { events, chatUploadFiles, setEvents, setCommandExecutor };
};

export default chat;
