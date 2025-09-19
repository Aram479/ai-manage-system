import { useRef, useState } from "react";
import localCache from "@/utils/cache";

const default_agent_config = localCache.getItem("agentConfig");

const agent = () => {
  // agent配置数据
  const agentConfig = useRef<IAgentConfig>(default_agent_config);
  // 当前agent角色
  const agentRole = useRef<IAgentCategoryRole>();

  const setAgentConfigAction = (config: any) => {
    localCache.setItem("agentConfig", config);
    agentConfig.current = config;
  };

  const setAgentRoleAction = (agentRoleItem: any) => {
    agentRole.current = agentRoleItem;
  };

  return {
    agentConfig,
    agentRole,
    setAgentConfigAction,
    setAgentRoleAction,
  };
};
export default agent;
