import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { PaperClipOutlined, UserOutlined } from "@ant-design/icons";
import { Bubble, Sender, SenderProps } from "@ant-design/x";
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";
import { useModel } from "@umijs/max";
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
import _ from "lodash";
import { Ai_Options } from "@/constant/base";
import useDeepSeekXChat from "@/hooks/useDeepSeekXChat";
import useQwenXChat from "@/hooks/useQwenXChat";
import { allTools } from "@/tools";
import SenderHeader from "@/pages/Chat/cpns/SenderHeader";
import styles from "./index.less";

const defaultPlaceholder = "别光看着我，快敲几个字让我知道你在想啥！";

export type TChatRef = {
  sendChat: (message: string) => void;
};
interface IChatCmpProps {
  isSender?: boolean;
  content?: string;
  onSuccess?: (messageData: TResultStream) => void;
}

const ChatCmp = (props: IChatCmpProps, ref: Ref<TChatRef>) => {
  const { content: contentProp, isSender = true, onSuccess } = props;
  const { menuList, userMenus } = useModel("user");
  const { chatUploadFiles } = useModel("chat");
  const [currentTag, setCurrentTag] = useState<(typeof messageTags)[number]>();
  const defaultModelInfo = Ai_Options[0];
  const [model, setModel] = useState<TAllModel>(
    defaultModelInfo.model?.default!
  );
  const [currentAi, setCurrentAi] = useState(defaultModelInfo);
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
  const [senderHeaderOpen, setSenderHeaderOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [messageTags, setMessageTags] = useState<
    (ButtonProps & { desc: string })[]
  >([
    {
      id: "deep",
      children: "深度思考",
      desc: "先思考后回答，解决推理问题",
    },
  ]);

  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  // 是否开启深度思考
  const isDeep = useRef(false);

  const defaultRequestConfig = useMemo(() => {
    const toolsProps = {
      menuList,
      userMenus,
    };
    return {
      requestBody: {
        stream: true,
        // max_tokens: 2048,
        // temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
        // top_p: 0.9, // 调整此值也可能影响简洁性
        model,
        // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
        tools: currentTag?.id === "deep" ? undefined : allTools(toolsProps), // 深度思考不支持tools
        // tool_choice: 'auto',
      },
      onSuccess: (messageData: TResultStream) => Ai_SuccessAction(messageData),
    };
  }, [currentTag?.id, model]);

  // 通义千问
  const Ai_Qwen = useQwenXChat(defaultRequestConfig);
  // deepseek
  const Ai_DeepSeek = useDeepSeekXChat(defaultRequestConfig);
  // 当前切换的ai
  const Ai_Primary = currentAi.key === "qwen" ? Ai_Qwen : Ai_DeepSeek;

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
    local: {
      placement: "end",
      avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
      // typing: { step: 5, interval: 20 },
      styles: {
        content: {
          padding: "12px 8px",
          background: "#e0dfff",
        },
      },
    },
  };

  const Ai_SuccessAction = (messageData: TResultStream) => {
    onSuccess?.(messageData);
  };

  const newItems = useMemo<BubbleDataType[]>(() => {
    return Ai_Primary.items;
  }, [Ai_Primary?.messages]);

  const handleSendChat: SenderProps["onSubmit"] = async (message) => {
    Ai_Primary.onRequest(message as any);
    setUploadFiles([]);
    setSenderHeaderOpen(false);
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

  const handleUploadFile = async (files: UploadFile[]) => {
    setUploadFiles(files);
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

  useEffect(() => {
    const deepTagIndex = messageTags.findIndex((item) => item.id == "deep")!;

    if (chatUploadFiles.current.length) {
      // 文档解析不能用深度思考
      messageTags[deepTagIndex].disabled = true;
      if (currentTag?.id === "deep") {
        isDeep.current = false;
        setCurrentTag(undefined);
        setPlaceholder(defaultPlaceholder);
      }
      // 解析文件要用qwen-long
      setModel("qwen-long");
    } else {
      messageTags[deepTagIndex].disabled = false;
      setModel(defaultModelInfo.model?.default!);
    }
    setMessageTags(messageTags);
  }, [chatUploadFiles.current]);

  // 暴露给父组件的属性
  useImperativeHandle(ref, () => ({
    sendChat: handleSendChat,
  }));

  // useEffect(() => {
  //   if (contentProp) {
  //     setContent(contentProp);
  //   }
  // }, [contentProp]);
  return (
    <div className={styles.chatBox}>
      <div className={styles.chatListBox}>
        <Bubble.List
          ref={listRef}
          className={styles.bubbleListBox}
          items={newItems}
          roles={roles}
        />
        {isSender && (
          <>
            <Flex gap="8px">
              {messageTags.map((item) => (
                <Tooltip key={item.id} title={item.desc} placement="top">
                  <Button
                    {...item}
                    disabled={
                      (currentTag && currentTag?.id !== item.id) ||
                      item.disabled
                    }
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
                    const newCurrentAiInfo = _.find(Ai_Options, [
                      "key",
                      item.key,
                    ])!;
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
                  files={uploadFiles}
                  open={senderHeaderOpen}
                  onUpload={handleUploadFile}
                  onOpenChange={setSenderHeaderOpen}
                />
              }
              disabled={
                !!uploadFiles.find((item) => item.status === "uploading")
              }
              prefix={attachmentsNode}
              placeholder={placeholder}
              loading={Ai_Primary.loading}
              onChange={setContent}
              onSubmit={handleSendChat}
              onCancel={handleStopChat}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default forwardRef(ChatCmp);
