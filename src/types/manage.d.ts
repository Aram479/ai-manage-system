type Dayjs = import("dayjs").Dayjs
interface IUserList {
  id: number | string;
  userName: string;
  role: string;
  phone: string | number;
  status: number;
  createTime: Dayjs | string;
  updateTime: Dayjs | string;
}

interface IOrderList {
  id: number | string;
  orderNo: string;
  userName: string;
  goodsName: string;
  goodsPrice: number;
  goodsDesc: string;
  goodsCount: number;
  payType: string;
  deliveryType: string;
  deliveryTime: string | Dayjs;
  createTime: string | Dayjs;
}
