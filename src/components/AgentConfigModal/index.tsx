import { useEffect, useRef } from "react";
import { Modal, ModalProps, Tabs } from "antd";
import AgentBasicTab from "./AgentBasicTab";
import AgentIframeTab from "./AgentIframeTab";
import { useModel } from "@umijs/max";

interface IAgentConfigModal extends ModalProps {
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const AgentConfigModal = (props: IAgentConfigModal) => {
  const { open, onOk, onCancel } = props;
  const { agentConfig } = useModel("agent");
  const basicTabRef = useRef<IAgentBasicTabRef>(null);
  const iframeTabRef = useRef<IAgentIframeTabRef>(null);
  const AgentTabs = [
    {
      key: "BasicTab",
      label: "基本",
      forceRender: true,
      children: <AgentBasicTab ref={basicTabRef} />,
    },
    {
      key: "IframeTab",
      label: "Iframe",
      forceRender: true,
      children: <AgentIframeTab ref={iframeTabRef} />,
    },
    {
      key: "Others",
      label: "其他",
      forceRender: true,
      children: <>暂无</>,
    },
  ];
  const handleConfirm = async () => {
    const basicTabFormData = await basicTabRef.current?.form?.validateFields();
    const iframeTabFormData =
      await iframeTabRef.current?.form?.validateFields();
    const configData = {
      basic: basicTabFormData,
      iframe: iframeTabFormData,
    };
    onOk?.(configData);
  };

  const handleCencel = () => {
    onCancel?.(false);
  };

  // Modal销毁时清空数据
  const resetAction = () => {
    basicTabRef.current?.form?.resetFields();
    iframeTabRef.current?.form?.resetFields();
  };

  useEffect(() => {
    // 打开/关闭清空数据
    resetAction();
    if (open) {
      basicTabRef.current?.form?.setFieldsValue(agentConfig.current?.basic);
      iframeTabRef.current?.form?.setFieldsValue(agentConfig.current?.iframe);
    }
  }, [open]);

  return (
    <div>
      <Modal
        {...props}
        title="Agent设置"
        okText="保存"
        open={open}
        maskClosable={false}
        width={800}
        styles={{
          body: {
            height: 500,
          },
        }}
        onOk={handleConfirm}
        onCancel={handleCencel}
      >
        <Tabs tabPosition="left" defaultActiveKey="BasicTab" items={AgentTabs} style={{ height: "100%" }} />
      </Modal>
    </div>
  );
};

export default AgentConfigModal;
