import { useMemo, useState } from "react";
import { Empty, Input, ModalProps, Tabs, TabsProps } from "antd";
import {
  AllAgentCategory,
  StudyAgentCategory,
  WorkAgentCategory,
} from "@/constant/agentCategory";
import CategoryCard from "./CategoryCard";
import SearchRole from "./SearchRole";

interface IAgentCategory extends ModalProps {}

const Default_Active_Tab = "AllCategory";

const SearchCmp = () => {
  return <Input placeholder="Basic usage" style={{ width: "100%" }} />;
};

const AgentCategory = (props: IAgentCategory) => {
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
