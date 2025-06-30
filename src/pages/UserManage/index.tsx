import { useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "@umijs/max";
import { Button, Card, message, PaginationProps } from "antd";
import { TableProps } from "antd/lib";
import { getColumns } from "./constants";
import SearchFormCmp from "./cpns/SearchFormCmp";
import styles from "./index.less";
import useTableColFilter from "@/hooks/useTableColFilter";
import PageTable from "@/components/PageTable";
import {
  createUserApi,
  deleteUserById,
  fetchUserList,
} from "@/services/api/userApi";
import CreateUserModal from "./cpns/CreateUserModal";
import dayjs from "dayjs";

type IDataType = any;

// MBOMPage页面
const UserManagePage = () => {
  const { filterData, setFilterData, colFilterFunc } = useTableColFilter();

  const [tableData, setTableData] = useState<IUserList[]>([]);
  const [searchData, setSearchData] = useState({});
  const [currentRecord, setCurrentRecord] = useState<IUserList>();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  // 整合搜索条件
  const tableSearchData = useMemo(
    () => ({ ...searchData, ...filterData }),
    [searchData, filterData]
  );
  // 分页
  const [pagination, setPatination] = useState<PaginationProps>({
    total: tableData.length,
    pageSize: 5,
    current: 1,
    showSizeChanger: true,
    pageSizeOptions: [5, 10, 20, 50],
  });

  const tableCallback = async (record: IUserList, type: string) => {
    setCurrentRecord(record);
    if (type === "edit") {
      setCreateUserOpen(true);
    } else if (type === "delete") {
      return deleteUserByIdReq.run(record.id);
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

  // 获取用户表格数据
  const getUserListReq = useRequest(fetchUserList, {
    manual: true,
    onSuccess: (res) => {
      const newUserList = res.data;
      setTableData(newUserList);
    },
  });

  // 新增用户
  const createUserReq = useRequest(createUserApi, {
    manual: true,
    throwOnError: true,
    onSuccess: () => {
      getUserListReq.run();
      setCreateUserOpen(false);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  // 删除用户
  const deleteUserByIdReq = useRequest(deleteUserById, {
    manual: true,
    onSuccess: () => {
      getUserListReq.run();
    },
  });

  const handleCreateUser = (data: any) => {
    createUserReq.run(data);
  };

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
    getUserListReq.run();
  }, [pagination.current, pagination.pageSize, tableSearchData]);

  return (
    <div className={`${styles.userManagePage} dap-main-content`}>
      <Card>
        <SearchFormCmp onSearch={handleSearch} onReset={handleResetSearch} />
      </Card>
      <Card title={"结果"}>
        <div className="btn-box">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateUserOpen(true)}
          >
            创建用户
          </Button>
        </div>
        <PageTable
          rowKey="id"
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          loading={getUserListReq.loading}
          bordered
          onChange={handleTableChange}
        />
      </Card>
      <CreateUserModal
        open={createUserOpen}
        data={currentRecord}
        onOk={handleCreateUser}
        onCancel={setCreateUserOpen}
        okButtonProps={{
          loading: createUserReq.loading,
        }}
      />
    </div>
  );
};

export default UserManagePage;
