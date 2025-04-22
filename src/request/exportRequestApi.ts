import { useRequest } from "@umijs/max";
import { message } from "antd";

// 模拟导出用户列表
export const exportUserListApi = () => {
  const request = useRequest(
    () => {
      message.loading({
        key: "export",
        content: "导出用户中...",
        duration: 0,
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    },
    {
      manual: true,
      fetchKey: () => Date.now().toString(),
      onSuccess: (file) => {
        window.open("/userList.xlsx");
        message.destroy("export");
      },
      onError: () => {
        message.destroy("export");
      },
    }
  );
  return request;
};

// 模拟导出订单列表
export const exportOrderListApi = () => {
  const request = useRequest(
    () => {
      message.loading({
        key: "export",
        content: "导出订单中...",
        duration: 0,
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    },
    {
      manual: true,
      fetchKey: () => Date.now().toString(),
      onSuccess: (file) => {
        window.open("/orderList.xlsx");
        message.destroy("export");
      },
      onError: () => {
        message.destroy("export");
      },
    }
  );
  return request;
};

// 模拟导出角色列表
export const exportRoleListApi = () => {
  const request = useRequest(
    () => {
      message.loading({
        key: "export",
        content: "导出角色中...",
        duration: 0,
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    },
    {
      manual: true,
      fetchKey: () => Date.now().toString(),
      onSuccess: (file) => {
        window.open("/roleList.xlsx");
        message.destroy("export");
      },
      onError: () => {
        message.destroy("export");
      },
    }
  );
  return request;
};
