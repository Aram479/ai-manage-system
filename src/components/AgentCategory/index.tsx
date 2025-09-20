import { useMemo, useState } from "react";
import { Empty, ModalProps, Tabs, TabsProps } from "antd";
import {
  AllAgentCategory,
  RolePlayAgentCategory,
  SocialAgentCategory,
  StudyAgentCategory,
  WorkAgentCategory,
} from "@/constant/agentCategory";
import CategoryCard from "./CategoryCard";
import SearchRole from "./SearchRole";

interface IAgentCategory extends ModalProps {
  open?: boolean;
  onChange?: (data?: IAgentCategoryRole) => void;
}

const Default_Active_Tab = "AllCategory";

const AgentCategory = (props: IAgentCategory) => {
  const { open, onChange } = props;
  const [searchValue, setSearchValue] = useState("");
  const [searchCategorys, setSearchCategorys] = useState<IAgentCategoryRole[]>(
    []
  );
  const [activeTab, setActiveTab] = useState(Default_Active_Tab);

  // 分类
  const AgentTabs: TabsProps["items"] = [
    {
      key: "AllCategory",
      label: "全部分类",
      children: <CategoryCard items={AllAgentCategory} onChange={onChange} />,
    },
    {
      key: "StudyCategory",
      label: "学习",
      children: <CategoryCard items={StudyAgentCategory} onChange={onChange} />,
    },
    {
      key: "WorkCategory",
      label: "工作",
      children: <CategoryCard items={WorkAgentCategory} onChange={onChange} />,
    },
    {
      key: "RolePlay",
      label: "角色扮演",
      children: (
        <CategoryCard items={RolePlayAgentCategory} onChange={onChange} />
      ),
    },
  ];

  // 搜索结果
  const AgentSearchTabs = useMemo<TabsProps["items"]>(
    () => [
      {
        key: "SearchResult",
        label: "搜索结果",
        disabled: true,
        children: !!searchCategorys.length ? (
          <CategoryCard items={searchCategorys} />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ),
      },
    ],
    [searchCategorys]
  );

  const handleTabChange: TabsProps["onChange"] = (activeKey) => {
    setActiveTab(activeKey);
  };

  const handleSearchRole = (value: string) => {
    const newItems = value
      ? AllAgentCategory?.filter((item) => ~item.title?.indexOf(value)!)
      : [];
    setSearchValue(value);
    setSearchCategorys(newItems);
  };

  return (
    <div>
      {searchValue ? (
        <Tabs
          defaultActiveKey="SearchResult"
          items={AgentSearchTabs}
          tabBarExtraContent={<SearchRole onChange={handleSearchRole} />}
        />
      ) : (
        <Tabs
          activeKey={activeTab}
          items={AgentTabs}
          tabBarExtraContent={<SearchRole onChange={handleSearchRole} />}
          onChange={handleTabChange}
        />
      )}
    </div>
  );
};

export default AgentCategory;
