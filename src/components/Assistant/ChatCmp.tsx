import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PaperClipOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
  message,
  Tooltip,
  UploadFile,
} from "antd";
import _ from "lodash";
import { Ai_Options } from "@/constant/base";
import useDeepSeekXChat from "@/hooks/useDeepSeekXChat";
import useQwenXChat from "@/hooks/useQwenXChat";
import { allTools } from "@/tools";
import { useParentMessage } from "@/hooks/useIframe";
import SenderHeader, { TSenderHeaderRef } from "./SenderHeader";
import LogoWhite from "@/asset/png/logoWhite.png";
import SettingOper from "../AgentOpeartion/SettingOper";
import CategoryOper from "../AgentOpeartion/CategoryOper";
import styles from "./index.less";

const defaultPlaceholder = "别光看着我，快敲几个字让我知道你在想啥！";

export type TChatRef = {
  sendChat: (message: string) => void;
};
interface IChatCmpProps {
  title?: string;
  agentRole?: IAgentCategoryRole;
  isGlobalConfig?: boolean;
  isSender?: boolean;
  content?: string; // 输入框内容
  onSuccess?: (messageData: TResultStream) => void;
}

const ChatCmp = (props: IChatCmpProps, ref: Ref<TChatRef>) => {
  const {
    agentRole = {
      title: "欢迎进入Veloce",
      desc: "您的专属超级智能体",
    },
    content: contentProp,
    isSender = true,
    isGlobalConfig = true,
    onSuccess,
  } = props;
  const { menuList, userMenus, userList } = useModel("user");
  const senderHeaderRef = useRef<TSenderHeaderRef>(null);
  const { orderList } = useModel("order");
  const { chatUploadFiles } = useModel("chat");
  const { agentConfig } = useModel("agent");
  const [currentTag, setCurrentTag] = useState<(typeof messageTags)[number]>();
  const defaultModelInfo = Ai_Options[0];
  const [model, setModel] = useState<TAllModel>(
    defaultModelInfo.model?.default!
  );
  // 是否联网搜索
  const [isOnlineSearch, setIsOnlineSearch] = useState(false);
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
      desc: "先思考后回答，支持自动联网搜索",
    },
    {
      id: "online",
      children: "联网搜索",
      desc: "联网搜索",
    },
  ]);

  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  // 是否开启深度思考
  const isDeep = useRef(false);

  const defaultRequestConfig = useMemo(() => {
    const toolsProps = {
      menuList,
      userMenus,
      userList,
      orderList,
    };
    return {
      agentRole,
      requestBody: {
        stream: true,
        // max_tokens: 2048,
        // temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
        // top_p: 0.9, // 调整此值也可能影响简洁性
        model,
        // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
        tools: currentTag?.id === "deep" ? undefined : allTools(toolsProps), // 深度思考不支持tools
        enable_search: isOnlineSearch,
        // tool_choice: 'auto',
      },
      onUpdate: (
        messageData: TResultStream,
        chatList?: any[],
        isComplete?: boolean
      ) => {
        if (agentConfig.current?.iframe.isDataTransfer) {
          sendMessageToParent({
            type: "update",
            payload: {
              messageData,
              list: chatList,
              isComplete,
            },
          });
        }
      },
      onSuccess: (messageData: TResultStream, chatList?: any[]): any =>
        Ai_SuccessAction(messageData, chatList),
    };
  }, [currentTag?.id, model, menuList, userMenus, userList]);

  // 向主页面发送消息
  const handleSendMessage: typeof defaultRequestConfig.onSuccess = (
    messageData,
    chatList
  ) => {
    sendMessageToParent({
      type: "success",
      payload: {
        messageData,
        list: chatList,
      },
    });
  };

  const { sendMessageToParent } = useParentMessage(
    agentConfig.current?.iframe.projectDomain || "http://localhost:3000"
  );
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
      avatar: {
        className: styles.agentChatIcon,
        icon: <img src={LogoWhite} />,
        style: {
          background: "#8985f6",
          padding: 8,
        },
      },
      typing: false,
      styles: {
        content: {
          minWidth: "calc(100% - 50px)",
          background: "#fff",
        },
      },
    },
    local: {
      placement: "end",
      // avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
      // typing: { step: 5, interval: 20 },
      typing: false,
      styles: {
        content: {
          padding: "12px 8px",
          background: "#e0dfff",
        },
      },
    },
  };

  const Ai_SuccessAction: typeof defaultRequestConfig.onSuccess = (
    messageData,
    chatList
  ) => {
    onSuccess?.(messageData);
    // 设置中开启数据交互时生效
    if (agentConfig.current?.iframe.isDataTransfer) {
      handleSendMessage(messageData, chatList);
    }
  };

  const newItems = useMemo<BubbleDataType[]>(() => {
    return Ai_Primary.items;
  }, [Ai_Primary?.messages]);

  const handleSendChat: SenderProps["onSubmit"] = async (message) => {
    Ai_Primary.onRequest(message as any);
    setContent("");
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
      setIsOnlineSearch(false);
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
    if (["online", "deep"].includes(item.id!)) {
      setIsOnlineSearch(true);
      if (item.id === "online") {
        setPlaceholder(
          "数据流已加载99%，剩下那1%靠演技撑着——谁还没个假装全知的时刻呢？"
        );
      }
    }

    setCurrentTag(item);
    setModel(currentAi.model?.deep!);
  };

  const handleResetChat = () => {
    Ai_Primary.onReset();
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
    const onlineTagIndex = messageTags.findIndex(
      (item) => item.id == "online"
    )!;
    if (chatUploadFiles.current.length) {
      // 深度思考、联网搜索不能进行文档解析
      messageTags[deepTagIndex].disabled = true;
      messageTags[onlineTagIndex].disabled = true;
      if (["deep", "online"].includes(currentTag?.id!)) {
        isDeep.current = false;
        setCurrentTag(undefined);
        setPlaceholder(defaultPlaceholder);
      }
      // 解析文件要用qwen-long
      setModel("qwen-long");
    } else {
      messageTags[deepTagIndex].disabled = false;
      messageTags[onlineTagIndex].disabled = false;
      // setModel(defaultModelInfo.model?.default!);
    }
    setMessageTags([...messageTags]);
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
        {newItems.length ? (
          <Bubble.List
            ref={listRef}
            className={styles.bubbleListBox}
            items={newItems}
            roles={roles}
          />
        ) : (
          // 智能体介绍
          <div className={styles.agentRoleBox}>
            <Flex gap={8} vertical align="center" justify="center">
              <div className={styles.title}>{agentRole?.title}</div>
              <div className={styles.desc}>{agentRole?.desc}</div>
            </Flex>
          </div>
        )}

        {isSender && (
          <>
            <Flex gap="8px">
              {messageTags.map((item) => (
                <Tooltip
                  key={item.id}
                  title={<div style={{ fontSize: 12 }}>{item.desc}</div>}
                  placement="top"
                >
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
                  当前模型：
                  {_.find(Ai_Options, ["key", currentAi.key])?.label}
                </Button>
              </Dropdown>
              {isGlobalConfig && (
                <>
                  <CategoryOper />
                  <SettingOper />
                </>
              )}
              <Tooltip title="重置对话">
                <Button
                  icon={<SyncOutlined />}
                  // loading={Ai_Primary.loading}
                  disabled={Ai_Primary.loading}
                  onClick={handleResetChat}
                />
              </Tooltip>
              {/* 重置 */}
            </Flex>
            <Sender
              value={content}
              header={
                <SenderHeader
                  ref={senderHeaderRef}
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
              onPasteFile={(file) =>
                senderHeaderRef.current?.uploadAction?.(file)
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default forwardRef(ChatCmp);
