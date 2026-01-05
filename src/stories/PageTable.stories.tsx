import type { Meta, StoryObj } from "@storybook/react";
import { UserList } from "@/services/api/userApi/mockData";
import { TableProps } from "antd";
import PageTable from "@/components/PageTable";
import { SettingOutlined } from "@ant-design/icons";

type Story = StoryObj<typeof meta>;

const meta = {
  title: "Example/PageTable",
  tags: ["autodocs"],
  component: PageTable,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "这是一个基于[Ant Design Table](https://ant-design.antgroup.com/components/table-cn)封装的组件，本组件只介绍与其不同之处",
      },
    },
  },
  argTypes: {},
  args: {
    columns: [
      {
        title: "用户名称",
        dataIndex: "userName",
        align: "center",
        width: 300,
      },
      {
        title: "手机号",
        dataIndex: "phone",
        align: "center",
        width: 300,
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        align: "center",
        width: 300,
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        align: "center",
        width: 300,
      },
    ],
    dataSource: UserList,
    bordered: true,
  },
} satisfies Meta<TableProps>;

export const OperateButton: Story = {
  name: "自定义操作按钮",
  parameters: {
    docs: {
      description: {
        story: "使用 **operateChildren** 属性为表格头部添加自定义操作",
      },
    },
  },
  render: (args) => (
    <PageTable {...args} operateChildren={<SettingOutlined />} />
  ),
};

export const Large: Story = {
  args: {
    size: "large",
  },
};

export const Small: Story = {
  args: {
    size: "small",
  },
};

export default meta;
