import _ from "lodash";

export function getColumns(props: any) {
  const { filterData, callback, getLocal } = props;

  return [
    {
      title: getLocal?.("Base.Index"),
      dataIndex: "order",
      align: "center",
      width: 300,
    },
    {
      title: getLocal?.("Sbom.ProcessTime"),
      dataIndex: "createTime",
      align: "center",
      width: 300,
    },
    {
      title: getLocal?.("Sbom.ProcessUser"),
      dataIndex: "userName",
      align: "center",
      width: 300,
    },
    {
      title: getLocal?.("Sbom.Desc"),
      dataIndex: "user",
      align: "center",
      width: 300,
    },
    {
      title: getLocal?.("Sbom.ObjectType"),
      dataIndex: "objectType",
      align: "center",
      width: 300,
    },
    {
      title: getLocal?.("Sbom.InfoType"),
      dataIndex: "infoType",
      align: "center",
    },
  ];
}
