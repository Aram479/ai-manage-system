import { useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useModel, useRequest } from "@umijs/max";
import { Button, Card, message, PaginationProps, Table } from "antd";
import { TableProps } from "antd/lib";
import { getColumns } from "./constants";
import SearchFormCmp from "./cpns/SearchFormCmp";
import styles from "./index.less";
import useTableColFilter from "@/hooks/useTableColFilter";
import { useChatEvent } from "@/hooks/useChatEvent";
import CreateOrderModalCmp from "./cpns/CreateOrderModalCmp";
import {
  OrderManageToolsEvents,
  TOrderManageTools,
} from "@/tools/orderManageTools";
import {
  createOrderApi,
  deleteOrderById,
  editOrderApi,
  fetchOrderList,
} from "@/services/api/orderApi";

// MBOMPage页面
const OrderManagePage = () => {
  const { setOrderList } = useModel("order");
  const { filterData, colFilterFunc } = useTableColFilter<IOrderList>();
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  const [tableData, setTableData] = useState<IOrderList[]>([]);
  const [searchData, setSearchData] = useState({});
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
  const tableCallback = async (record: IOrderList, type: string) => {
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

  // 获取订单表格数据
  const getOrderListReq = useRequest(
    () => {
      return fetchOrderList(tableSearchData);
    },
    {
      manual: true,
      onSuccess: (res) => {
        const newOrderList = res.data;
        setOrderList([...newOrderList]);
        setTableData(newOrderList);
      },
    }
  );

  // 新增用户
  const createOrderReq = useRequest(createOrderApi, {
    manual: true,
    throwOnError: true,
    onSuccess: () => {
      setCreateOrderOpen(false);
      getOrderListReq.run();
      message.destroy("createOrder");
    },
    onError: (error) => {
      message.error(error.message);
      message.destroy("createOrder");
    },
  });

  // 修改用户
  const editOrderByIdReq = useRequest(editOrderApi, {
    manual: true,
    onSuccess: () => {
      setCreateOrderOpen(false);
      getOrderListReq.run();
      message.destroy("editOrder");
    },
    onError: (error) => {
      message.error(error.message);
      message.destroy("editOrder");
    },
  });

  // 删除用户
  const deleteOrderByIdReq = useRequest(deleteOrderById, {
    manual: true,
    onSuccess: () => {
      getOrderListReq.run();
      message.destroy("deleteOrder");
    },
    onError: (error) => {
      message.error(error.message);
      message.destroy("deleteOrder");
    },
  });

  const handleCreateOrEditOrder = (data: any) => {
    if (!data.id) {
      createOrderReq.run(data);
    } else {
      editOrderByIdReq.run(data);
    }
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
    getOrderListReq.run();
  }, [pagination.current, pagination.pageSize, tableSearchData]);

  useChatEvent<TOrderManageTools>((event) => {
    if (event.name === OrderManageToolsEvents.Create_Order) {
      const chatData = event.data as any;
      if (chatData) {
        message.loading({
          key: "createOrder",
          content: "新增订单中...",
          duration: 0,
        });
        createOrderReq.run(chatData);
      }
    } else if (event.name === OrderManageToolsEvents.Edit_Order) {
      const chatData = event.data as any;
      if (chatData) {
        message.loading({
          key: "editOrder",
          content: "修改订单中...",
          duration: 0,
        });
        editOrderByIdReq.run(chatData);
      }
    } else if (event.name === OrderManageToolsEvents.Delete_Order) {
      const chatData = event.data;
      if (chatData) {
        message.loading({
          key: "deleteOrder",
          content: "删除订单中...",
          duration: 0,
        });
        if (chatData?.id) {
          deleteOrderByIdReq.run(chatData.id as number | string);
        }
      }
    }
  });

  return (
    <div className={`${styles.orderManagePage} dap-main-content`}>
      <Card>
        <SearchFormCmp onSearch={handleSearch} onReset={handleResetSearch} />
      </Card>
      <Card title={"结果"}>
        <div className="btn-box">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOrderOpen(true)}
          >
            新增订单
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          bordered
          loading={getOrderListReq.loading}
          onChange={handleTableChange}
        />
      </Card>
      <CreateOrderModalCmp
        open={createOrderOpen}
        onOk={handleCreateOrEditOrder}
        onCancel={setCreateOrderOpen}
        okButtonProps={{
          loading: createOrderReq.loading || editOrderByIdReq.loading,
        }}
      />
    </div>
  );
};

export default OrderManagePage;
