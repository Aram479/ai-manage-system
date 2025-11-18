import React, { useEffect, useRef, useState } from "react";
import { Flex, Tabs, TabsProps } from "antd";
import { AllAgentCategory } from "@/constant/agentCategory";
import ChatCmp, { TChatRef } from "../Assistant/ChatCmp";
import CategoryOper from "../AgentOpeartion/CategoryOper";
import SettingOper from "../AgentOpeartion/SettingOper";
import _ from "lodash";
import styles from "./index.less";
import {
  AgentRoleProvider,
  useAgentRoleContext,
} from "@/context/AgentRoleContext";

interface IAgentByRoleTabs extends TabsProps {}

const Default_Active_Tab = "defaultAgent";

const AgentByRoleTabs = (props: IAgentByRoleTabs) => {
  const defaultAgent = AllAgentCategory.find(
    (item) => item.key === "defaultAgent"
  )!;
  const defaultAgentTab = {
    key: defaultAgent?.key || "",
    label: defaultAgent?.title,
    closable: false,
    children: <ChatCmp agentRole={defaultAgent} isGlobalConfig={false} />,
  };
  const { updateSelectRole, updateConfirmRole } = useAgentRoleContext();
  const [roleAgentTabs, setRoleAgentTabs] = useState([defaultAgentTab]);
  const [activeTab, setActiveTab] = useState(Default_Active_Tab);
  const chatRefs = useRef<Record<string, React.RefObject<TChatRef>>>({});

  const getChatRef = (id: string): React.RefObject<TChatRef> => {
    if (!chatRefs.current[id]) {
      chatRefs.current[id] = React.createRef<TChatRef>();
    }
    return chatRefs.current[id];
  };

  const handleTabAddOrDel: TabsProps["onEdit"] = (key, action) => {
    if (action === "remove") {
      const newTabs = roleAgentTabs.filter((item) => item.key !== key);
      const newActiveTab = newTabs[newTabs.length - 1].key;
      setActiveTab(newActiveTab);
      setRoleAgentTabs(newTabs);
    }
  };
  const handleTabChange: TabsProps["onChange"] = (activeKey) => {
    const newChartRef = chatRefs.current[activeKey];
    newChartRef.current?.hideDrawer();
    setActiveTab(activeKey);
  };

  const handlAegentChange = (agentRecord: IAgentCategoryRole) => {
    const sameAgentRole = roleAgentTabs.find(
      (item) => item.key === agentRecord.key
    );
    if (!sameAgentRole) {
      const newRoleAgentTab = {
        key: agentRecord.key as string,
        label: agentRecord.title,
        closable: true,
        children: (
          <ChatCmp
            ref={getChatRef(activeTab)}
            agentRole={agentRecord}
            isGlobalConfig={false}
          />
        ),
      };
      setRoleAgentTabs([...roleAgentTabs, newRoleAgentTab]);
      setActiveTab(agentRecord.key as string);
    } else {
      setActiveTab(sameAgentRole.key as string);
    }
  };

  useEffect(() => {
    const activeTabItem = AllAgentCategory.find(
      (item) => item.key === activeTab
    );
    updateConfirmRole?.(activeTabItem);
    updateSelectRole?.(activeTabItem);
    getChatRef(activeTab);
  }, [activeTab]);

  return (
    <Tabs
      className={styles.agentByRoleTabs}
      type="editable-card"
      activeKey={activeTab}
      items={roleAgentTabs}
      hideAdd
      tabBarExtraContent={
        <Flex gap={8}>
          <CategoryOper onOk={handlAegentChange} />
          <SettingOper />
        </Flex>
      }
      onEdit={handleTabAddOrDel}
      onChange={handleTabChange}
      {...props}
    />
  );
};

const AgentByRoleTabsProvider = (props: IAgentByRoleTabs) => {
  return (
    <AgentRoleProvider>
      <AgentByRoleTabs {...props} />
    </AgentRoleProvider>
  );
};
export default AgentByRoleTabsProvider;
