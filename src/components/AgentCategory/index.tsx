import { useEffect, useState } from "react";
import { ModalProps, Tabs, TabsProps } from "antd";
import CategoryCard from "./CategoryCard";
import {
  AllAgentCategory,
  StudyAgentCategory,
  WorkAgentCategory,
} from "@/constant/agentCategory";

interface IAgentCategoryRole extends ModalProps {}

const Default_Active_Tab = "AllCategory";
const AgentCategory = (props: IAgentCategoryRole) => {
  const [activeTab, setActiveTab] = useState(Default_Active_Tab);

  const AgentTabs: TabsProps["items"] = [
    {
      key: "AllCategory",
      label: "全部分类",
      children: <CategoryCard items={AllAgentCategory} />,
    },
    {
      key: "StudyCategory",
      label: "学习",
      children: <CategoryCard items={StudyAgentCategory} />,
    },
    {
      key: "WorkCategory",
      label: "工作",
      children: <CategoryCard items={WorkAgentCategory} />,
    },
  ];
  const handleTabChange: TabsProps["onChange"] = (activeKey) => {
    setActiveTab(activeKey);
  };

  useEffect(() => {}, []);

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        items={AgentTabs}
        onChange={handleTabChange}
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default AgentCategory;
