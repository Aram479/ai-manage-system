import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  ButtonProps,
  Flex,
  GetProp,
  GetRef,
  Tag,
  TagProps,
} from "antd";
import {
  CopyOutlined,
  CopyrightOutlined,
  DislikeOutlined,
  FireOutlined,
  LikeOutlined,
  LoadingOutlined,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";
import { XAgentConfigCustom } from "@ant-design/x/es/use-x-agent";
import { deepSeekPrompt, deepSeektools } from "@/constant/deepSeek.constant";
import dayjs, { Dayjs } from "dayjs";

import {
  Bubble,
  Prompts,
  Sender,
  SenderProps,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import {
  formartResultMessage,
  StreamDataProcessor,
} from "@/utils/deepseek.utils";
import { v4 as uuidv4 } from "uuid";
import { useDeepSeekXChat, useStreamController } from "@/hooks/deepSeek.hooks";
import { deepSeekOpenAI, deepSeekXRequest } from "@/services/deepseek.api";
import WelcomeCmp from "@/component/WelcomeCmp";
import MarkDown from "@/component/MarkDownCmp";
import styles from "./index.less";
import _ from "lodash";
import { message as AMessage } from "antd";
import ClipboardUtil from "@/utils/clipboardUtil";
import { history } from "@umijs/max";
const MarkDownCmp = memo(MarkDown);

const MainPage = () => {
  const [model, setModel] = useState<TDeepSeekModel>("deepseek-chat");
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isHeader, setIsHeader] = useState(true);
  const [messageTags, setMessageTags] = useState<ButtonProps[]>([
    {
      id: "consideration",
      children: "深度思考",
    },
    {
      id: "autoChat",
      children: "自动对话",
    },
  ]);
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  // 是否开启深度思考
  const isConsideration = useRef(false);
  // 是否开启自动对话
  const isAutoChat = useRef(false);
  // AI1 对话完成事件
  const successAction = (messageData: TResultStream) => {
    if (!streamClass?.writable.locked && isAutoChat.current) {
      onAutoRequest(messageData.chatContent);
    }
  };

  // AI2 对话完成事件
  const successAutoAction = (messageData: TResultStream) => {
    // isAutoChat.current = true;
    /** TODO 优化点：
     * 问题：每当自动对话结束时，用户自动对话的思考message会消失
     * 原因：出现在这，因为这里只发送了chatContent没有发送ctmpContent
     * 阻碍：优化此项需要更改 deepSeek.hooks.ts的chatRequest中messagesData参数类型
     */
    onRequest(messageData.chatContent);
  };

  const { messages, streamClass, loading, onRequest, onCancel } =
    useDeepSeekXChat({
      requestInfo: {
        model: model,
        stream: true,
        max_tokens: 2048,
        temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
        top_p: 0.9, // 调整此值也可能影响简洁性
        // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
        // tools 不支持模型 deepseek-reasoner
        tool_choice: "auto",
      },
      onSuccess: successAction,
    });

  const {
    messages: autoMessage,
    streamClass: autoStreamClass,
    loading: autoLoading,
    chatList: autoChatList,
    isStreaming: autoIsStreaming,
    isStreamLocked: autoIsStreamLocked,
    onRequest: onAutoRequest,
    onCancel: onAutoCancel,
  } = useDeepSeekXChat({
    /* "从现在开始你只需要帮助我对话就行，不需要思考太多，不需要问太多，你只需要帮助我回答我说的话就行; 这句话你不用回复我" +
        deepSeekPrompt.concise, */
    defaultMessage: "",
    requestInfo: {
      model: model,
      stream: true,
      max_tokens: 2048,
      temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
      top_p: 0.9, // 调整此值也可能影响简洁性
      // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
      // tools 不支持模型 deepseek-reasoner
      // tools: deepSeektools,
      tool_choice: "auto",
    },
    onSuccess: successAutoAction,
  });

  // 对话时，用户和AI样式
  const roles: GetProp<typeof Bubble.List, "roles"> = {
    assistant: {
      placement: "start",
      avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
      typing: { step: 5, interval: 20 },
      styles: {
        content: {
          minWidth: "calc(100% - 50px)",
          background: "#fff",
        },
      },
    },
    local: {
      placement: "end",
      avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
      // typing: { step: 5, interval: 20 },
      styles: {
        content: {
          background: "#e0dfff",
        },
      },
    },
  };

  const items: BubbleDataType[] = useMemo(() => {
    let newItems = [];
    const newMessages = messages.map((item) => ({
      ...item,
      key: item.id,
      role: item.status === "local" ? item.status : "assistant",
      content:
        (item.message.chatContent || item.message.toolContent) ?? item.message,
      loading: item.status === "loading" && !streamClass?.readable.locked,
    }));

    newItems = [...newMessages];

    const lastAutoMessage = autoMessage?.[autoMessage.length - 1];

    // 当user自动对话加载时，实时更新message
    if (autoLoading && lastAutoMessage) {
      let newLastAutoMessage = {
        ...lastAutoMessage,
        key: `auto_${lastAutoMessage.id}`,
        role: "local",
        content:
          (lastAutoMessage.message.chatContent ||
            lastAutoMessage.message.toolContent) ??
          lastAutoMessage.message,
        loading: autoLoading,
      };
      if (autoIsStreaming.current) {
        newLastAutoMessage = {
          ...newLastAutoMessage,
          loading:
            lastAutoMessage.status === "loading" && !autoIsStreaming.current,
        };
      }

      newItems = [...newItems, newLastAutoMessage];
    }

    return newItems.map(({ message, status, ...item }) => ({
      ...item,
      messageRender: (content) =>
        status !== "local" ? (
          !message.abortedReason ? (
            <div>
              {message.ctmpContent && (
                <div className={styles.ctmpMessageBox}>
                  {/* 思考状态 */}
                  <div className={styles.ctmpTimeBox}>
                    <div>
                      <CopyrightOutlined />
                    </div>
                    <div>{message.ctmpLoadingMessage}</div>
                  </div>
                  {/* 思考内容 */}
                  <div className={styles.ctmpContentBox}>
                    {message.ctmpContent}
                  </div>
                </div>
              )}

              <div style={{ background: "auto" }}>
                <MarkDownCmp
                  theme="onDark"
                  content={String(content)}
                  loading={loading}
                />
                {status === "success" && (
                  <div className={styles.messageFooterBox}>
                    <LikeOutlined
                      onClick={_.throttle(() => {
                        AMessage.success({
                          key: "thanks",
                          content: "感谢您的支持",
                        });
                      }, 300)}
                    />
                    <DislikeOutlined />
                    <CopyOutlined
                      onClick={_.throttle(() => {
                        ClipboardUtil.writeText(content);
                        AMessage.success({
                          key: "copy",
                          content: "复制成功",
                        });
                      }, 300)}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>{message.abortedReason}</>
          )
        ) : (
          <div>
            {isAutoChat.current ? (
              <MarkDownCmp
                theme="onDark"
                content={String(content)}
                loading={loading}
              />
            ) : (
              content
            )}
          </div>
        ),
    }));
  }, [messages, autoMessage]);

  const handleSendChat: SenderProps["onSubmit"] = (message) => {
    setIsHeader(false);
    setContent("");
    onRequest(message as any);
  };

  const handleStopChat: SenderProps["onCancel"] = () => {
    // onAutoCancel();
    onCancel();
  };

  const handleTagItem = (item: ButtonProps) => {
    // consideration autoChat

    if (item.id === "consideration") {
      isConsideration.current = true;
      isAutoChat.current = false;
      setModel("deepseek-reasoner");
      setPlaceholder("已开启深度思考");
    } else if (item.id === "autoChat") {
      isConsideration.current = false;
      isAutoChat.current = true;
      setModel("deepseek-chat");
      setPlaceholder("请输入一个话题，即可开始对话");
    }
  };
  return (
    <div className={styles.mainPage}>
      {isHeader && (
        <div>
          <WelcomeCmp />
        </div>
      )}
      <div className={styles.chatListBox}>
        <Bubble.List
          ref={listRef}
          className={styles.bubbleListBox}
          items={items}
          roles={roles}
        />

        {/* 🌟 提示词 */}
        {/* <Prompts items={senderPromptsItems} /> */}

        <Flex gap="8px">
          {messageTags.map((item) => (
            <Button
              variant="solid"
              {...item}
              onClick={() => handleTagItem(item)}
            />
          ))}
        </Flex>

        <Sender
          value={content}
          placeholder={placeholder}
          loading={loading}
          onChange={setContent}
          onSubmit={handleSendChat}
          onCancel={handleStopChat}
        />
      </div>
    </div>
  );
};

export default MainPage;
