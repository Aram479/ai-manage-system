import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

export function getColumns(props: TGetColumns): ColumnsType {
  const { filterData, callback, getLocal } = props;

  return [
    {
      title: "用户名称",
      dataIndex: "userName",
      align: "center",
      width: 300,
    },
    {
      title: "角色",
      dataIndex: "role",
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
      title: "状态",
      dataIndex: "status",
      align: "center",
      width: 300,
      render: (value) => (value ? "启用" : "禁用"),
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
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      render: (_v, record) => (
        <>
          <Flex gap="small">
            <Button
              color="primary"
              variant="solid"
              size="small"
              icon={<EditOutlined />}
              onClick={() => callback?.(record, "edit")}
            >
              修改
            </Button>
            <Popconfirm
              title="确定删除此数据吗？"
              onConfirm={() => callback?.(record, "delete")}
              okButtonProps={{
                color: "danger",
                variant: "solid",
              }}
            >
              <Button
                color="danger"
                variant="solid"
                size="small"
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          </Flex>
        </>
      ),
    },
  ];
}
