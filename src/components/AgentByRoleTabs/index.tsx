import { useState } from "react";
import { Flex, Tabs, TabsProps } from "antd";
import _ from "lodash";
import { AllAgentCategory } from "@/constant/agentCategory";
import ChatCmp from "../Assistant/ChatCmp";
import CategoryOper from "../AgentOpeartion/CategoryOper";
import SettingOper from "../AgentOpeartion/SettingOper";

interface IAgentByRoleTabs {}

const Default_Active_Tab = "defaultAgent";

const AgentByRoleTabs = (props: IAgentByRoleTabs) => {
  const defaultAgent = AllAgentCategory.find(
    (item) => item.key === "defaultAgent"
  );
  const defaultAgentTab = {
    key: defaultAgent?.key || "",
    label: defaultAgent?.title,
    closable: false,
    children: <ChatCmp isGlobalConfig={false} />,
  };
  const [roleAgentTabs, setRoleAgentTabs] = useState([defaultAgentTab]);
  const [activeTab, setActiveTab] = useState(Default_Active_Tab);

  const handleTabAddOrDel: TabsProps["onEdit"] = (key, action) => {
    if (action === "remove") {
      const newTabs = roleAgentTabs.filter((item) => item.key !== key);
      const newActiveTab = newTabs[newTabs.length - 1].key;
      setActiveTab(newActiveTab);
      setRoleAgentTabs(newTabs);
    }
  };
  const handleTabChange: TabsProps["onChange"] = (activeKey) => {
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
        children: <ChatCmp isGlobalConfig={false} />,
      };
      setRoleAgentTabs([...roleAgentTabs, newRoleAgentTab]);
      setActiveTab(agentRecord.key as string);
    } else {
      setActiveTab(sameAgentRole.key as string);
    }
  };

  return (
    <div>
      <Tabs
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
      />
    </div>
  );
};

export default AgentByRoleTabs;
