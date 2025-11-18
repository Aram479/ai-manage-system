import React, { useMemo, useState } from "react";
import { Drawer, DrawerProps, Empty, Flex, Input, Tabs, TabsProps } from "antd";
import Icon from "@ant-design/icons";
import { chatPrompt } from "@/constant/base";
import routes from "@/../config/routes";
import CommandList, { ICommandListProps } from "./CommandList";
import SearchCommand from "./SearchCommand";
import _ from "lodash";

interface ICommandCenterTabsDrawerProps extends DrawerProps {
  onItemClick?: (data: any) => void;
}

const Default_Active_Tab = "PageCommand";
const CommandCenterTabsDrawer = (props: ICommandCenterTabsDrawerProps) => {
  const { onItemClick, ...draweProps } = props;
  const systemRoutes = _.find(routes, { name: "System" })?.routes;
  const [activeTab, setActiveTab] = useState(Default_Active_Tab);
  const [searchValue, setSearchValue] = useState("");
  const [searchCommands, setSearchCommands] = useState<
    ICommandListProps["items"]
  >([]);
  const routeItems = useMemo(() => {
    const arr = systemRoutes
      ?.filter((item) => item.name)
      .map((item, index) => {
        const icon = item.meta?.icon as any;
        const iconNode = icon
          ? React.createElement(Icon, {
              component: icon,
              style: { fontSize: "1.4em" },
            })
          : undefined;
        return {
          key: item.path,
          label: item.meta?.title || "",
          value: chatPrompt.page(item.meta?.title),
          // icon: iconNode
        };
      });
    return arr ?? [];
  }, [systemRoutes]);
  const chartItems = [
    {
      key: "pieCommand",
      label: "饼图",
      value: chatPrompt.chart("饼图"),
    },
    {
      key: "barCommand",
      label: "柱状图",
      value: chatPrompt.chart("柱状图"),
    },
    {
      key: "lineCommand",
      label: "折线图",
      value: chatPrompt.chart("折线图"),
    },
    {
      key: "waterfallCommand",
      label: "瀑布图",
      value: chatPrompt.chart("瀑布图"),
    },

    {
      key: "stockCommand",
      label: "股票图",
      value: chatPrompt.chart("股票图"),
    },
  ];
  const AgentTabs = [
    {
      key: "PageCommand",
      label: "页面",
      forceRender: true,
      children: <CommandList items={routeItems} onItemClick={onItemClick} />,
    },
    {
      key: "ChartCommand",
      label: "图表",
      forceRender: true,
      children: <CommandList items={chartItems} onItemClick={onItemClick} />,
    },
  ];

  const handleSearchCommand = (value: string) => {
    const newItems = value
      ? [...routeItems, ...chartItems]?.filter(
          (item) => ~item.label?.indexOf(value) || ~item.value?.indexOf(value)
        )
      : [];
    setSearchValue(value);
    setSearchCommands(newItems);
  };

  const handleTabChange: TabsProps["onChange"] = (activeKey) => {
    setActiveTab(activeKey);
  };

  return (
    <Drawer
      {...draweProps}
      mask={false}
      maskClosable={false}
      styles={{
        body: {
          padding: "5px 24px",
          paddingBottom: 20,
        },
      }}
    >
      <Flex vertical gap={10}>
        <SearchCommand onChange={handleSearchCommand} />
        {searchValue ? (
          <>
            {!!searchCommands.length ? (
              <CommandList items={searchCommands} onItemClick={onItemClick} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </>
        ) : (
          <Tabs
            activeKey={activeTab}
            items={AgentTabs}
            onChange={handleTabChange}
          />
        )}
      </Flex>
    </Drawer>
  );
};

export default CommandCenterTabsDrawer;
