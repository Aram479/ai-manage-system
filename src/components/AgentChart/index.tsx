import { ReactNode, useState } from "react";
import { Button, Flex, Input, Popover } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import useQwenXChat, { IUseQwenXChat } from "@/hooks/useQwenXChat";
import { ChartToolsEvents, ChartToolsFunctions } from "@/tools/chartsTools";
import styles from "./index.less";
import { Sender } from "@ant-design/x";

interface IAgentChart {
  children?: ReactNode;
  tools?: ChartToolsEvents[];
  chartConfig?: any;
  onAgentChat?: (config: any) => void;
}

const AgentChart = (props: IAgentChart) => {
  const { children, tools, chartConfig, onAgentChat } = props;
  const [message, setMessage] = useState("");
  const defaultRequestConfig: IUseQwenXChat = {
    // agentRole: confirmRole,
    requestBody: {
      stream: false,
      max_tokens: 2048,
      temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
      top_p: 0.9, // 调整此值也可能影响简洁性
      model: "qwen-max",
      tools: Object.values(ChartToolsFunctions)
        .filter((func) => tools?.includes(func.name as ChartToolsEvents))
        .map((func) => func({ chartConfig })), // 深度思考不支持tools
      // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
      enable_search: true,
      // tool_choice: 'auto',
    },

    onSuccess: (messageData, _l, _i, _agentRole): any => {
      try {
        if (messageData.toolContent) {
          const newConfig = JSON.parse(messageData.toolContent);
          onAgentChat?.(newConfig);
        }
      } catch (error) {
        console.log("命令错误，请重试");
      }
    },
  };

  // 通义千问
  const Ai_Qwen = useQwenXChat(defaultRequestConfig);

  const handleSend = () => {
    Ai_Qwen.onRequest(message);
    setMessage("");
  };

  return (
    <div>
      <Flex justify="end">
        <Popover
          trigger={["click"]}
          arrow={false}
          styles={{ body: { width: 300 } }}
          content={
            <Sender
              placeholder="说出需求，AI帮你修改"
              loading={Ai_Qwen.loading}
              value={message}
              onChange={(v) => setMessage(v)}
              onSubmit={handleSend}
              onCancel={() => {
                Ai_Qwen.onCancel();
              }}
            />
          }
          placement="topLeft"
        >
          {chartConfig && <Button icon={<BulbOutlined />} />}
        </Popover>
      </Flex>
      <>{children}</>
    </div>
  );
};

export default AgentChart;
