import { useState } from "react";
import { Button, message, Tooltip } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import AgentConfigModal from "../AgentConfigModal";

const SettingOper = () => {
  const [agentConfigOpen, setAgentConfigOpen] = useState(false);
  const { setAgentConfigAction } = useModel("agent");
  const handleAgentConfig = () => {
    setAgentConfigOpen(true);
  };
  const handleAgentConfigConfirm = (configData: any) => {
    setAgentConfigAction(configData);
    setAgentConfigOpen(false);
    message.success("保存成功");
  };
  return (
    <div>
      <Tooltip title={<div style={{ fontSize: 12 }}>设置</div>} placement="top">
        <Button
          variant="outlined"
          icon={<SettingOutlined />}
          onClick={handleAgentConfig}
        />
      </Tooltip>
      <AgentConfigModal
        open={agentConfigOpen}
        onOk={handleAgentConfigConfirm}
        onCancel={setAgentConfigOpen}
      />
    </div>
  );
};

export default SettingOper;
