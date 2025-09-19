import { useEffect, useState } from "react";
import { Modal, ModalProps } from "antd";
import { useModel } from "@umijs/max";
import AgentCategory from "../AgentCategory";

interface IAgentConfigModal extends ModalProps {
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const AgentCategoryModal = (props: IAgentConfigModal) => {
  const { open, onOk, onCancel } = props;
  const { setAgentRoleAction } = useModel("agent");
  const [currentAgentRole, setCurrentAgentRole] =
    useState<IAgentCategoryRole>();

  const handleAgentRole = (agentRoleRecord: typeof currentAgentRole) => {
    setCurrentAgentRole(agentRoleRecord);
  };

  const handleConfirm = () => {
    setAgentRoleAction(currentAgentRole || {});
    onOk?.(currentAgentRole);
  };

  const handleCencel = () => {
    onCancel?.(false);
  };

  return (
    <div>
      <Modal
        {...props}
        title="Agent分类"
        okText="确定"
        open={open}
        width={800}
        maskClosable={false}
        destroyOnClose
        styles={{
          body: {
            height: 500,
            overflowY: "auto",
          },
        }}
        onOk={handleConfirm}
        onCancel={handleCencel}
      >
        <AgentCategory open={open} onChange={handleAgentRole} />
      </Modal>
    </div>
  );
};

export default AgentCategoryModal;
