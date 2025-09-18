import { useRef, useState } from "react";
import localCache from "@/utils/cache";

const default_agent_config = localCache.getItem("agentConfig");

const agent = () => {
  // agent配置数据
  const agentConfig = useRef<IAgentConfig>(default_agent_config);

  const setAgentConfigAction = (config: any) => {
    localCache.setItem("agentConfig", config);
    agentConfig.current = config;
  };

  return {
    agentConfig,
    setAgentConfigAction,
  };
};
export default agent;
