import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonProps, Flex, GetProp, GetRef, Tooltip } from "antd";
import {
  CopyOutlined,
  CopyrightOutlined,
  DislikeOutlined,
  LikeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";

import { Bubble, Sender, SenderProps } from "@ant-design/x";

import { useDeepSeekXChat } from "@/hooks/deepSeek.hooks";
import WelcomeCmp from "@/component/WelcomeCmp";
import MarkDown from "@/component/MarkDownCmp";
import styles from "./index.less";
import _ from "lodash";
import { message as AMessage } from "antd";
import ClipboardUtil from "@/utils/clipboardUtil";
import { chatsCrossMerge } from "@/utils/deepseek.utils";
const MarkDownCmp = memo(MarkDown);

const defaultPlaceholder = "别光看着我，快敲几个字让我知道你在想啥！";
const MainPage = () => {
  const [model, setModel] = useState<TDeepSeekModel>("deepseek-chat");
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
  const [defaultTwoMessage, setDefaulTwoMessage] = useState("");
  const [isHeader, setIsHeader] = useState(true);
  const [messageTags, setMessageTags] = useState<
    (ButtonProps & { desc: string })[]
  >([
    {
      id: "consideration",
      children: "深度思考",
      desc: "先思考后回答，解决推理问题",
    },
    {
      id: "autoChat",
      children: "自动对话",
      desc: "请输入一个话题，即可开始对话",
    },
  ]);

  const [currentTag, setCurrentTag] = useState<(typeof messageTags)[number]>();

  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  // 是否开启深度思考
  const isConsideration = useRef(false);
  // 是否开启自动对话
  const isAutoChat = useRef(false);
  // AI1 对话完成事件
  const successAction = (messageData: TResultStream) => {
    if (!Ai_Two.streamClass?.writable.locked && isAutoChat.current) {
      Ai_Two.onRequest(messageData.chatContent);
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
    Ai_One.onRequest(messageData.chatContent);
  };

  const requestConfig = {
    stream: true,
    max_tokens: 2048,
    temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
    top_p: 0.9, // 调整此值也可能影响简洁性
    // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
    // tools 不支持模型 deepseek-reasoner
    tool_choice: "auto",
  };
  const Ai_One = useDeepSeekXChat({
    requestBody: {
      ...requestConfig,
      model,
    },
    onSuccess: successAction,
  });

  const Ai_Two = useDeepSeekXChat({
    /* "从现在开始你只需要帮助我对话就行，不需要思考太多，不需要问太多，你只需要帮助我回答我说的话就行; 这句话你不用回复我" +
        deepSeekPrompt.concise, */
    defaultMessage: `${defaultTwoMessage}:`,
    requestBody: {
      ...requestConfig,
      model,
    },
    onSuccess: successAutoAction,
  });
  const Ai_Three = useDeepSeekXChat({
    /* "从现在开始你只需要帮助我对话就行，不需要思考太多，不需要问太多，你只需要帮助我回答我说的话就行; 这句话你不用回复我" +
        deepSeekPrompt.concise, */
    defaultMessage: `${defaultTwoMessage}:`,
    requestBody: {
      ...requestConfig,
      model,
    },
    onSuccess: successAutoAction,
  });

  // 对话时，用户和AI样式
  const roles: GetProp<typeof Bubble.List, "roles"> = {
    system: {
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

  const newItems = useMemo<BubbleDataType[]>(() => {
    // 自动对话模式
    if (isAutoChat.current) {
      // 只获取AI1的回答，不包括我的
      const oneItemsByAssistant = Ai_One.items.filter(
        (item) => item.role === "assistant"
      );

      // 将AI2的对话转换为我说的，默认第一条为我最开始说的
      const twoItemsByAssistant = [
        Ai_One.items[0] ?? {},
        ...Ai_Two.items
          .filter((item) => item.role === "assistant")
          .map((item) => ({ ...item, role: "local" })),
      ];
      return chatsCrossMerge(oneItemsByAssistant, twoItemsByAssistant);
    } else {
      // 正常模式
      return Ai_One.items;
    }
  }, [Ai_One.messages, Ai_Two.messages]);

  const items: BubbleDataType[] = useMemo(() => {
    let newItems = [];
    const newMessages = Ai_One.messages.map((item) => ({
      ...item,
      key: item.id,
      role: item.status === "local" ? item.status : "assistant",
      content:
        (item.message.chatContent || item.message.toolContent) ?? item.message,
      loading:
        item.status === "loading" && !Ai_One.streamClass?.readable.locked,
    }));

    newItems = [...newMessages];

    const lastTwoMessage = Ai_Two.messages?.[Ai_Two.messages.length - 1];

    // 当user自动对话加载时，实时更新message
    if (Ai_Two.loading && lastTwoMessage) {
      let newLastTwoMessage = {
        ...lastTwoMessage,
        key: `auto_${lastTwoMessage.id}`,
        role: "local",
        content:
          (lastTwoMessage.message.chatContent ||
            lastTwoMessage.message.toolContent) ??
          lastTwoMessage.message,
        loading: Ai_Two.loading as boolean,
      };
      if (Ai_Two.isStreaming.current) {
        newLastTwoMessage = {
          ...newLastTwoMessage,
          loading:
            lastTwoMessage.status === "loading" && !Ai_Two.isStreaming.current,
        };
      }

      newItems = [...newItems, newLastTwoMessage];
    }

    return newItems.map(({ message, status, ...item }) => ({
      ...item,
      id: String(item.key),
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
                  loading={Ai_One.loading}
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
                loading={Ai_One.loading}
              />
            ) : (
              content
            )}
          </div>
        ),
    }));
  }, [Ai_One.messages, Ai_Two.messages]);

  const handleSendChat: SenderProps["onSubmit"] = (message) => {
    if (!defaultTwoMessage) setDefaulTwoMessage(message);
    setIsHeader(false);
    setContent("");
    Ai_One.onRequest(message as any);
  };

  const handleStopChat: SenderProps["onCancel"] = () => {
    // onAutoCancel();
    Ai_One.onCancel();
  };

  const handleTagItem = (item: (typeof messageTags)[number]) => {
    // 再次点击自己则取消
    if (item.id == currentTag?.id) {
      setCurrentTag(undefined);
      setPlaceholder(defaultPlaceholder);
      return;
    }
    // consideration autoChat
    setCurrentTag(item);

    if (item.id === "consideration") {
      isConsideration.current = true;
      isAutoChat.current = false;
      setModel("deepseek-reasoner");
      setPlaceholder(
        "深度思考已启动...大概吧，谁在乎呢？反正我也挺擅长假装在思考的。"
      );
    } else if (item.id === "autoChat") {
      isConsideration.current = false;
      isAutoChat.current = true;
      setModel("deepseek-chat");
      setPlaceholder("随便说点什么，我都行...毕竟今天也是不想动脑子的一天。");
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
          items={newItems}
          roles={roles}
        />

        {/* 🌟 提示词 */}
        {/* <Prompts items={senderPromptsItems} /> */}

        <Flex gap="8px">
          {messageTags.map((item) => (
            <Tooltip title={item.desc} placement="top">
              <Button
                {...item}
                color={currentTag?.id === item.id ? "primary" : undefined}
                variant="outlined"
                onClick={() => handleTagItem(item)}
              />
            </Tooltip>
          ))}
        </Flex>

        <Sender
          value={content}
          placeholder={placeholder}
          loading={Ai_One.loading}
          onChange={setContent}
          onSubmit={handleSendChat}
          onCancel={handleStopChat}
        />
      </div>
    </div>
  );
};

export default MainPage;
