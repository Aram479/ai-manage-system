import { useEffect, useMemo, useState } from "react";
import { ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { useRequest } from "@umijs/max";
import { Button, Card, PaginationProps, Table } from "antd";
import { TableProps } from "antd/lib";
import { getColumns } from "./constants";
import SearchFormCmp from "./cpns/SearchFormCmp";
import styles from "./index.less";
import useTableColFilter from "@/hooks/useTableColFilter";
import { useChatEvent } from "@/hooks/useChatEvent";

type IDataType = any;

// MBOMPage页面
const UserManagePage = () => {
  const { filterData, setFilterData, colFilterFunc } = useTableColFilter();

  const [tableData, setTableData] = useState<IDataType[]>([]);
  const [searchData, setSearchData] = useState({});
  // 整合搜索条件
  const tableSearchData = useMemo(
    () => ({ ...searchData, ...filterData }),
    [searchData, filterData]
  );
  // 分页
  const [pagination, setPatination] = useState<PaginationProps>({
    total: tableData.length,
    pageSize: 10,
    current: 1,
    showSizeChanger: true,
    pageSizeOptions: [5, 10, 20, 50],
  });
  const tableCallback = async (record: IDataType, type: string) => {
    if (type === "edit") {
      // ...做点什么
    } else if (type === "delete") {
      // ...做点什么
    } else if (type === "filter") {
      setPatination({
        ...pagination,
        current: 1,
      });
      colFilterFunc(record);
    }
  };
  // colmuns事件集合
  const columns = useMemo(
    () =>
      getColumns({
        filterData,
        callback: tableCallback,
      }),
    [tableData]
  );
  // 获取表格数据
  const { loading: tableLoading, run: getEntityListReq } = useRequest(
    () => {
      const { current, pageSize } = pagination;
      return new Promise((resolve) =>
        resolve({
          status: 0,
          data: {
            count: 30,
            rows: [],
          },
        })
      );
      // return getEntityListApi({ page: current, perPage: pageSize, ...tableSearchData });
    },
    {
      debounceInterval: 500,
      manual: true,
      onSuccess: (res) => {},
    }
  );
  // 搜索事件
  const handleSearch = (searchValues: any) => {
    setSearchData({ ...searchValues });
    setPatination({ ...pagination, current: 1 });
  };

  // 重置搜索
  const handleResetSearch = () => {
    setSearchData({});
    setPatination({ ...pagination, current: 1 });
  };

  // 表格事件: 分页、排序、筛选变化时触发
  const handleTableChange: TableProps["onChange"] = (
    pageData,
    filter,
    sorter
  ) => {
    const { current, pageSize } = pageData;
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  };

  useEffect(() => {
    getEntityListReq();
  }, [pagination.current, pagination.pageSize, tableSearchData]);

  return (
    <div className={`${styles.userManagePage} dap-main-content`}>
      <Card>
        <SearchFormCmp onSearch={handleSearch} onReset={handleResetSearch} />
      </Card>
      <Card title={"结果"}>
        <div className="btn-box">
          <Button type="primary" icon={<PlusOutlined />}>
            创建角色
          </Button>
        </div>
        <Table
          rowKey="part"
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          bordered
          loading={false}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default UserManagePage;
