import { useState } from "react";

const order = () => {
  const [orderList, setOrderList] = useState<IOrderList[]>([]);

  return {
    orderList,
    setOrderList,
  };
};
export default order;
