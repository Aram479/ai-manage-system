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
  defaultMessage?: string;
}

interface IAgentIframeTabRef extends IAgentTabItemRef {}

interface IAgentIframeTabFormData {
  projectDomain?: string;
  isDataTransfer?: boolean;
}

interface IAgentCategoryRole {
  key?: string;
  icon?: any
  title?: string;
  desc?: string;
  greet?: string;
  prompt?: string;
  collect?: number;
  hot?: number;
  hideFooter?: boolean
}
