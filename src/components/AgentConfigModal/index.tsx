import { useEffect, useRef, useState } from "react";
import { Modal, ModalProps, Tabs, TabsProps } from "antd";
import AgentBasicTab from "./AgentBasicTab";
import AgentIframeTab from "./AgentIframeTab";
import { useModel } from "@umijs/max";

interface IAgentConfigModal extends ModalProps {
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const Default_Active_Tab = "BasicTab";
const AgentConfigModal = (props: IAgentConfigModal) => {
  const { open, onOk, onCancel } = props;
  const { agentConfig } = useModel("agent");
  const [activeTab, setActiveTab] = useState(Default_Active_Tab);
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

  // 初始化Tab表单数据
  const initTabFormDataAction = () => {
    basicTabRef.current?.form?.setFieldsValue(agentConfig.current?.basic);
    iframeTabRef.current?.form?.setFieldsValue(agentConfig.current?.iframe);
  };

  const handleTabChange: TabsProps["onChange"] = (activeKey) => {
    setActiveTab(activeKey);
    // TODO 应用后，切换时，又重置之前的值了
    initTabFormDataAction();
  };

  const handleConfirm = async () => {
    const basicTabFormValid = basicTabRef.current?.form?.validateFields();
    const iframeTabFormValid = iframeTabRef.current?.form?.validateFields();
    const [basicTabFormData, iframeTabFormData] = await Promise.all([
      basicTabFormValid,
      iframeTabFormValid,
    ]);
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
      initTabFormDataAction();
      setActiveTab(Default_Active_Tab);
    }
  }, [open]);

  return (
    <div>
      <Modal
        {...props}
        title="Agent设置"
        okText="确定"
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
        <Tabs
          tabPosition="left"
          activeKey={activeTab}
          items={AgentTabs}
          onChange={handleTabChange}
          style={{ height: "100%" }}
        />
      </Modal>
    </div>
  );
};

export default AgentConfigModal;
