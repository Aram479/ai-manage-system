import { useCallback, useMemo, useRef, useState } from "react";
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
import SenderHeader from "./cpns/SenderHeader";
import { Ai_Options } from "@/constant//base";
import useDeepSeekXChat from "@/hooks/useDeepSeekXChat";
import useQwenXChat from "@/hooks/useQwenXChat";
import { allTools } from "@/tools";

const defaultPlaceholder = "别光看着我，快敲几个字让我知道你在想啥！";

const ChatPage = () => {
  const defaultModelInfo = Ai_Options[0];
  const [model, setModel] = useState<TAllModel>(
    defaultModelInfo.model?.default!
  );
  const [currentAi, setCurrentAi] = useState(defaultModelInfo);
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
  const [senderHeaderOpen, setSenderHeaderOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  const defaultRequestConfig = {
    requestBody: {
      stream: true,
      max_tokens: 2048,
      temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
      top_p: 0.9, // 调整此值也可能影响简洁性
      model,
      // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
      tools: allTools, //不支持模型 deepseek-reasoner
      // tool_choice: "auto",
    },
    onSuccess: (messageData: TResultStream) => Ai_SuccessAction(messageData),
  };

  // 通义千问
  const Ai_Qwen = useQwenXChat(defaultRequestConfig);
  // deepseek
  const Ai_DeepSeek = useDeepSeekXChat(defaultRequestConfig);
  // 当前切换的ai
  const Ai_Primary = currentAi.key === "qwen" ? Ai_Qwen : Ai_DeepSeek;

  // 记录用户正常对话时，截止的位置
  const [isHeader, setIsHeader] = useState(true);

  const [messageTags, setMessageTags] = useState<
    (ButtonProps & { desc: string })[]
  >([
    {
      id: "deep",
      children: "深度思考",
      desc: "先思考后回答，解决推理问题",
    },
  ]);

  const [currentTag, setCurrentTag] = useState<(typeof messageTags)[number]>();

  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  // 是否开启深度思考
  const isDeep = useRef(false);

  // 对话完成事件
  // const Ai_SuccessAction = (messageData: TResultStream) => {};

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

  const Ai_SuccessAction = (messageData: TResultStream) => {
    // console.log("messageData", messageData);
  };

  const newItems = useMemo<BubbleDataType[]>(() => {
    return Ai_Primary.items;
  }, [Ai_Primary?.messages]);

  const handleSendChat: SenderProps["onSubmit"] = async (message) => {
    setIsHeader(false);
    setContent("");
    Ai_Primary.onRequest(message as any);
  };

  const handleStopChat: SenderProps["onCancel"] = () => {
    Ai_Primary.onCancel();
  };

  const handleTagItem = (item: (typeof messageTags)[number]) => {
    // 再次点击自己则取消
    if (item.id == currentTag?.id) {
      isDeep.current = false;
      setModel(currentAi.model?.default!);
      setCurrentTag(undefined);
      setPlaceholder(defaultPlaceholder);
      return;
    }

    if (item.id === "deep") {
      isDeep.current = true;
      setPlaceholder(
        "深度思考已启动...大概吧，谁在乎呢？反正我也挺擅长假装在思考的。"
      );
    }

    setCurrentTag(item);
    setModel(currentAi.model?.deep!);
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
    <div className={styles.chatPage}>
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
                const newCurrentAiInfo = _.find(Ai_Options, ["key", item.key])!;
                setModel(
                  isDeep.current
                    ? newCurrentAiInfo.model?.deep!
                    : newCurrentAiInfo.model?.default!
                );
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
          loading={Ai_Primary.loading}
          onChange={setContent}
          onSubmit={handleSendChat}
          onCancel={handleStopChat}
        />
      </div>
    </div>
  );
};

export default ChatPage;
