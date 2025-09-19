import { useEffect } from "react";
import { Modal, ModalProps } from "antd";
import { useModel } from "@umijs/max";
import AgentCategory from "../AgentCategory";

interface IAgentConfigModal extends ModalProps {
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const AgentCategoryModal = (props: IAgentConfigModal) => {
  const { open, onOk, onCancel } = props;

  const handleCencel = () => {
    onCancel?.(false);
  };

  useEffect(() => {
    if (open) {
    }
  }, [open]);

  return (
    <div>
      <Modal
        {...props}
        title="Agent分类"
        okText="确定"
        open={open}
        footer={false}
        maskClosable={false}
        width={800}
        styles={{
          body: {
            height: 500,
            overflowY: 'auto'
          },
        }}
        onCancel={handleCencel}
      >
        <AgentCategory />
      </Modal>
    </div>
  );
};

export default AgentCategoryModal;
