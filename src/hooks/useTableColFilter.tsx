import { useState } from 'react';

const useTableColFilter = () => {
  const [filterData, setFilterData] = useState({});

  // table自定义列筛选事件
  const colFilterFunc = (record: any) => {
    const newFilterData = { ...filterData, ...record };
    // 若筛选数据有空数据则清除
    for (let key in newFilterData) {
      if (newFilterData[key] === undefined) {
        delete newFilterData[key];
      }
    }
    setFilterData(newFilterData);
  };

  return {
    filterData,
    setFilterData,
    colFilterFunc,
  };
};

export default useTableColFilter;
