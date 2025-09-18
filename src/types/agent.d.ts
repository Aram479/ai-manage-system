interface IAgentConfig {
  basic: IAgentBasicTabFormData;
  iframe: IAgentIframeTabFormData;
}
FormInstance;
interface IAgentTabItemRef {
  form: import("antd").FormProps["form"];
}

interface IAgentBasicTabRef extends IAgentTabItemRef {}

interface IAgentBasicTabFormData {
  qwenApiKey?: string;
}

interface IAgentIframeTabRef extends IAgentTabItemRef {}

interface IAgentIframeTabFormData {
  projectDomain?: string;
  isDataTransfer?: boolean;
}
