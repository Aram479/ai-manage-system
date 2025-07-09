import { mockRequest } from "@/services/mockRequest";
import { OrderList } from "./mockData";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { TOrderFormData } from "@/pages/OrderManage/cpns/SearchFormCmp";

export const fetchOrderList = (searchData?: TOrderFormData) => {
  const newOrderList = OrderList.filter((item) => {
    if (!searchData || !Object.keys(searchData).length) return true;

    const { userName, goodsName, goodsPrice, createTime } = searchData;
    const conditions = [
      { key: "userName", value: userName, isExact: false },
      { key: "goodsName", value: goodsName, isExact: false }, // 设置isExact来区分精确匹配还是模糊匹配
      { key: "goodsPrice", value: String(goodsPrice), isExact: false },
      {
        key: "createTime",
        value: createTime ? dayjs(createTime).format("YYYY-MM-DD") : undefined,
        isExact: true,
      },
    ];
    const validConditions = conditions.filter(
      (condition) => condition.value != null
    );

    return validConditions.every((condition) => {
      let itemValue = String(item[condition.key]);
      if (condition.isExact) {
        if (condition.key === "createTime") {
          itemValue = dayjs(itemValue).format("YYYY-MM-DD");
        }
        return itemValue == condition.value;
      } else {
        console.log(condition.value);
        return itemValue.toLowerCase().includes(condition.value?.toLowerCase());
      }
    });
  }).sort(
    (a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf()
  );
  return mockRequest<IOrderList[]>(newOrderList);
};

export const deleteOrderById = (id: number | string) => {
  const delOrderData = OrderList.find((item) => item.id == id);
  if (!delOrderData) {
    return mockRequest<any>(null, {
      code: 400,
      data: null,
      message: "用户不存在",
    });
  }
  const deleteIndex = OrderList.findIndex((item) => item.id == id);
  OrderList.splice(deleteIndex, 1);
  return mockRequest<any>({});
};

export const createOrderApi = (data: IOrderList) => {
  if (OrderList.find((item) => item.userName === data.userName)) {
    return mockRequest<any>(null, {
      code: 400,
      data: null,
      message: "已存在用户订单",
    });
  }
  const nowTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const uuid = uuidv4();
  const newData: typeof data = {
    ...data,
    id: uuid,
    createTime: nowTime,
  };
  OrderList.push(newData);
  return mockRequest<any>({});
};

export const editOrderApi = (data: IOrderList) => {
  const editOrderData = OrderList.find((item) => item.id == data.id);
  if (!editOrderData) {
    return mockRequest<any>(null, {
      code: 400,
      data: null,
      message: "订单不存在",
    });
  }
  const isOrderNameInclude = OrderList.filter(
    (item) => item.id !== editOrderData.id
  ).find((item) => item.userName === editOrderData.userName);
  if (isOrderNameInclude) {
    return mockRequest<any>(null, {
      code: 400,
      data: null,
      message: "订单已存在",
    });
  }
  const editIndex = OrderList.findIndex((item) => item.id == editOrderData.id);
  const newData: typeof editOrderData = {
    ...data,
    id: editOrderData.id,
  };
  OrderList.splice(editIndex, 1, newData);
  return mockRequest<any>({});
};
