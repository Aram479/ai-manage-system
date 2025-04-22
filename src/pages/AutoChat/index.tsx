import { useMemo, useRef, useState } from "react";
import {
  Badge,
  Button,
  ButtonProps,
  Dropdown,
  Flex,
  GetProp,
  GetRef,
  Tooltip,
  UploadFile,
} from "antd";
import { PaperClipOutlined, UserOutlined } from "@ant-design/icons";
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";

import { Bubble, Sender, SenderProps } from "@ant-design/x";

import WelcomeCmp from "@/components/WelcomeCmp";
import styles from "./index.less";
import _ from "lodash";
import { chatsCrossMerge } from "@/utils/deepseek.utils";
import SenderHeader from "./cpns/SenderHeader";
import { Ai_Options } from "@/constant//base";
import useQwenXChat from "@/hooks/useQwenXChat";

const defaultPlaceholder = "别光看着我，快敲几个字让我知道你在想啥！";
const AutoChatPage = () => {
  const defaultModelInfo = Ai_Options[0];
  const [model, setModel] = useState<TAllModel>(
    defaultModelInfo.model?.default!
  );
  const [currentAi, setCurrentAi] = useState(defaultModelInfo);
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
  const [defaultTwoMessage, setDefaulTwoMessage] = useState("");
  const [endIndex, setEndIndex] = useState(1);
  const [senderHeaderOpen, setSenderHeaderOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const Ai_XChatHook = useQwenXChat;

  // 记录用户正常对话(非自动对话)时，截止的位置
  const [isHeader, setIsHeader] = useState(true);

  const [messageTags, setMessageTags] = useState<
    (ButtonProps & { desc: string })[]
  >([
    {
      id: "autoChat",
      children: "自动对话",
      desc: "请输入一个话题，即可开始对话",
    },
  ]);

  const [currentTag, setCurrentTag] = useState<(typeof messageTags)[number]>();

  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  // 是否开启深度思考
  const isDeep = useRef(false);
  // 是否开启自动对话
  const isAutoChat = useRef(false);

  // AI1 对话完成事件
  const Ai_One_SuccessAction = (messageData: TResultStream) => {
    if (!isAutoChat.current) {
      setEndIndex(endIndex + 1);
    }
    // TODO 切换聊天类型时，消息不应该随时改变
    if (!Ai_Two.streamClass?.writable.locked && isAutoChat.current) {
      Ai_Two.onRequest(messageData.chatContent || '');
    }
  };

  // AI2 对话完成事件
  const Ai_Two_SuccessAction = (messageData: TResultStream) => {
    // isAutoChat.current = true;
    Ai_One.onRequest(messageData.chatContent || '');
  };

  const requestConfig = {
    stream: true,
    max_tokens: 2048,
    temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
    top_p: 0.9, // 调整此值也可能影响简洁性
    // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
    // tools 不支持模型 deepseek-reasoner
    // tool_choice: "auto",
  };

  const Ai_One = Ai_XChatHook({
    requestBody: {
      ...requestConfig,
      model,
    },
    onSuccess: Ai_One_SuccessAction,
  });

  const Ai_Two = Ai_XChatHook({
    /* "从现在开始你只需要帮助我对话就行，不需要思考太多，不需要问太多，你只需要帮助我回答我说的话就行; 这句话你不用回复我" +
        deepSeekPrompt.concise, */
    defaultMessage: `${defaultTwoMessage}:`,
    requestBody: {
      ...requestConfig,
      model,
    },
    onSuccess: Ai_Two_SuccessAction,
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
    system: {
      placement: "start",
      avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
      typing: { step: 5, interval: 20 },
      styles: {
        content: {
          minWidth: "calc(100% - 50px)",
          background: "skyblue",
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

  const aaa = (
    items: BubbleDataType[],
    aiName: string,
    toName: string
  ): BubbleDataType | unknown => {
    const lastItem = _.last(items);
    if (lastItem?.role === aiName) {
      lastItem.role = toName;
      return lastItem;
    }
    return false;
  };

  const newItems = useMemo<BubbleDataType[]>(() => {
    // 自动对话模式 且 ai1输出完毕后 执行
    if (isAutoChat.current) {
      // 只获取AI1的回答，不包括我的
      const oneItemsByAssistant = Ai_One.items.filter(
        (item) => item.role === "assistant"
      );

      const twoItemsByAssistant = [
        ...Ai_One.items
          .slice(0, endIndex)
          .filter((item) => item.role === "local"),
        ...Ai_Two.items
          .filter((item) => item.role === "assistant")
          .map((item) => ({ ...item, role: "local" })),
      ];
      return chatsCrossMerge(oneItemsByAssistant, twoItemsByAssistant);
    } else {
      // 正常模式
      return Ai_One.items;
    }
  }, [Ai_One.messages, Ai_Two.messages, endIndex]);

  const handleSendChat: SenderProps["onSubmit"] = async (message) => {
    // 开启自动对话
    if (isAutoChat.current && !defaultTwoMessage) {
      setEndIndex(endIndex + 1);
      setDefaulTwoMessage(message);
    }
    setIsHeader(false);
    setContent("");
    Ai_One.onRequest(message as any);
  };

  const handleStopChat: SenderProps["onCancel"] = () => {
    Ai_One.onCancel();
    Ai_Two.onCancel();
  };

  const handleTagItem = (item: (typeof messageTags)[number]) => {
    // 再次点击自己则取消
    if (item.id == currentTag?.id) {
      isAutoChat.current = false;
      setCurrentTag(undefined);
      setPlaceholder(defaultPlaceholder);
      return;
    }
    // deep autoChat
    setCurrentTag(item);

    if (item.id === "deep") {
      isDeep.current = true;
      isAutoChat.current = false;
      setModel(currentAi.model?.deep!);
      setPlaceholder(
        "深度思考已启动...大概吧，谁在乎呢？反正我也挺擅长假装在思考的。"
      );
    } else if (item.id === "autoChat") {
      isDeep.current = false;
      isAutoChat.current = true;
      setModel(currentAi.model?.autoChat!);
      setPlaceholder("随便说点什么，我都行...毕竟今天也是不想动脑子的一天。");
    }
  };

  // 输入框左侧图标
  const attachmentsNode = (
    <Badge dot={uploadFiles.length > 0 && !senderHeaderOpen}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={() => setSenderHeaderOpen(!senderHeaderOpen)}
      />
    </Badge>
  );

  return (
    <div className={styles.autoChatPage}>
      {isHeader && (
        <div>
          <WelcomeCmp title="当前页面支持自动对话功能" />
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
                disabled={currentTag && currentTag?.id !== item.id}
                color={currentTag?.id === item.id ? "primary" : undefined}
                variant="outlined"
                onClick={() => handleTagItem(item)}
              />
            </Tooltip>
          ))}
          <Dropdown
            placement="top"
            menu={{
              items: Ai_Options,
              onClick: (item: (typeof Ai_Options)[number]) => {
                const newCurrentAiInfo = _.find(Ai_Options, ["key", item.key]);
                setModel(newCurrentAiInfo?.model?.default!);
                setCurrentAi(newCurrentAiInfo!);
              },
            }}
          >
            <Button>
              当前模型：{_.find(Ai_Options, ["key", currentAi.key])?.label}
            </Button>
          </Dropdown>
        </Flex>
        <Sender
          value={content}
          header={
            <SenderHeader
              open={senderHeaderOpen}
              onUpload={setUploadFiles}
              onOpenChange={setSenderHeaderOpen}
            />
          }
          prefix={attachmentsNode}
          placeholder={placeholder}
          loading={Ai_One.loading || Ai_Two.loading}
          onChange={setContent}
          onSubmit={handleSendChat}
          onCancel={handleStopChat}
        />
      </div>
    </div>
  );
};

export default AutoChatPage;
