import { ColumnsType } from "antd/es/table";
import _ from "lodash";

export function getColumns(props: any):ColumnsType {
  const { filterData, callback, getLocal } = props;

  return [
    {
      title: "序号",
      dataIndex: "index",
      align: "center",
      width: 300,
    },
    {
      title: "角色名称",
      dataIndex: "RoleName",
      align: "center",
      width: 300,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      align: "center",
      width: 300,
    },
  ];
}
