import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { PaperClipOutlined, SyncOutlined } from "@ant-design/icons";
import { RenderChildrenProps } from "@ant-design/x/es/suggestion";
import {
  Bubble,
  Prompts,
  Sender,
  SenderProps,
  Suggestion,
  SuggestionProps,
  Welcome,
} from "@ant-design/x";
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
import { useParentMessage } from "@/hooks/useIframe";
import SenderHeader, { TSenderHeaderRef } from "./SenderHeader";
import Logo from "@/asset/png/logo.png";
import LogoWhite from "@/asset/png/logoWhite.png";
import SettingOper from "../AgentOpeartion/SettingOper";
import CategoryOper from "../AgentOpeartion/CategoryOper";
import HistorySentDrawer from "./HistorySentDrawer";
import CommandCenterTabsDrawer from "../CommandCenter/CommandCenterTabsDrawer";
import routes from "@/../config/routes";
import styles from "./index.less";

const defaultPlaceholder = "别光看着我，快敲几个字让我知道你在想啥！";

export type TChatRef = {
  hideDrawer: () => void;
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
  // 查找routes下System的子route
  const systemRoutes = _.find(routes, { name: "System" })?.routes;
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
  const [historySentOpen, setHistorySentOpen] = useState(false);
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [chatListByUser, setChatListByUser] = useState<TChatList>([]);
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
  const suggestions = useMemo<SuggestionProps["items"]>(() => {
    return [
      { label: "历史发送", value: "historySent" },
      { label: "指令中心", value: "commandCenter" },
    ];
  }, []);

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
      onSuccess: (
        messageData: TResultStream,
        chatList?: any[],
        isComplete?: boolean
      ): any => Ai_SuccessAction(messageData, chatList, isComplete),
    };
  }, [currentTag?.id, model, menuList, userMenus, userList]);

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
    chatList,
    isComplete
  ) => {
    onSuccess?.(messageData);
    // 设置中开启数据交互时生效
    if (agentConfig.current?.iframe.isDataTransfer) {
      sendMessageToParent({
        type: "success",
        payload: {
          messageData,
          list: chatList,
          isComplete,
        },
      });
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

  const suggestionInupt = (value: string, events: RenderChildrenProps<any>) => {
    const { onTrigger } = events;
    if (value === "/") {
      onTrigger();
    } else if (!value) {
      onTrigger(false);
    }
  };

  const handleSuggestion: SuggestionProps["onSelect"] = (value) => {
    if (value === "historySent") {
      setHistorySentOpen(true);
      return;
    } else if (value === "commandCenter") {
      setCommandCenterOpen(true);
      return;
    }
    setContent(value);
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

  useEffect(() => {
    const newListByUser = _.filter(Ai_Primary.chatList, { role: "user" }).map(
      (item, index) => ({ ...item, id: index + 1 })
    );
    setChatListByUser(newListByUser);
  }, [Ai_Primary.messages]);

  // 关闭对话发送Drawer
  const hideDrawer = () => {
    setCommandCenterOpen(false)
    setHistorySentOpen(false);
  };
  // 暴露给父组件的属性
  useImperativeHandle(ref, () => ({
    hideDrawer,
    sendChat: handleSendChat,
  }));

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
          // <div className={styles.agentRoleBox}>
          //   <Flex gap={8} vertical align="center" justify="center">
          //     <div className={styles.title}>{agentRole?.title}</div>
          //     <div className={styles.desc}>{agentRole?.desc}</div>
          //   </Flex>
          // </div>
          <Flex gap={10} vertical wrap style={{ height: "100%" }}>
            <Welcome
              icon={
                <img
                  src={
                    agentRole.avatar
                      ? `https://img.loliapi.com/i/pp/img${agentRole.avatar}.webp`
                      : Logo
                  }
                  className={styles.avatarLogo}
                />
              }
              title={agentRole?.title}
              description={agentRole?.desc}
              style={{
                backgroundColor: "#ffffff00",
                backgroundImage:
                  "linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)",
              }}
            />
            <Prompts
              items={agentRole.promptList}
              vertical
              onItemClick={(item) => {
                handleSendChat(item.data.description as string);
              }}
            />
          </Flex>
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

            {/* 快捷指令 */}
            <Suggestion items={suggestions} onSelect={handleSuggestion}>
              {({ onTrigger, onKeyDown }) => (
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
                  onChange={(value) => {
                    suggestionInupt(value, { onTrigger, onKeyDown });
                    if (value.length === 1 && value === "/") return;
                    setContent(value);
                  }}
                  onKeyDown={onKeyDown}
                  onSubmit={(value) => {
                    handleSendChat(value);
                  }}
                  onCancel={handleStopChat}
                  onPasteFile={(file) =>
                    senderHeaderRef.current?.uploadAction?.(file)
                  }
                />
              )}
            </Suggestion>
          </>
        )}
      </div>
      <CommandCenterTabsDrawer
        title="指令中心"
        open={commandCenterOpen}
        onItemClick={(data) => setContent(data.value)}
        onClose={() => setCommandCenterOpen(false)}
      />
      <HistorySentDrawer
        title="历史发送"
        width={500}
        open={historySentOpen}
        chatList={chatListByUser}
        onClose={() => setHistorySentOpen(false)}
        onSend={handleSendChat}
      />
    </div>
  );
};

export default forwardRef(ChatCmp);
