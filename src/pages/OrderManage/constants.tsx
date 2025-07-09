import { ColumnsType } from "antd/es/table";
import _ from "lodash";

export function getColumns(props: any): ColumnsType {
  const { filterData, callback, getLocal } = props;

  return [
    {
      title: "订单号",
      dataIndex: "orderNo",
      align: "center",
      width: 300,
    },
    {
      title: "用户名称",
      dataIndex: "userName",
      align: "center",
      width: 300,
    },
    {
      title: "商品名称",
      dataIndex: "goodsName",
      align: "center",
      width: 300,
    },
    {
      title: "数量",
      dataIndex: "goodsCount",
      align: "center",
      width: 300,
    },
    {
      title: "商品价格",
      dataIndex: "goodsPrice",
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
