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
      title: "订单号",
      dataIndex: "createTime",
      align: "center",
      width: 300,
    },
    {
      title: "订单名称",
      dataIndex: "userName",
      align: "center",
      width: 300,
    },
    {
      title: "创建时间",
      dataIndex: "userName",
      align: "center",
      width: 300,
    },
  ];
}
