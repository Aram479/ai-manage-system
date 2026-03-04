import { Modal, ModalProps } from "antd";
import { useModel } from "@umijs/max";
import AgentCategory from ".";
import { useAgentRoleContext } from "@/context/AgentRoleContext";

interface IAgentConfigModal extends ModalProps {
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const AgentCategoryModal = (props: IAgentConfigModal) => {
  const { open, onOk, onCancel } = props;
  const { selectRole, confirmRole, updateSelectRole, updateConfirmRole } = useAgentRoleContext();

  const handleConfirm = () => {
    updateConfirmRole?.(selectRole);
    onOk?.(selectRole);
  };

  const handleCencel = () => {
    updateSelectRole?.(confirmRole)
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
        <AgentCategory open={open} />
      </Modal>
    </div>
  );
};

export default AgentCategoryModal;
