import { useState, useCallback } from "react";

// 强制渲染页面
const useForceUpdate = () => {
  const [, setTick] = useState(0); // 只需要 setTick 函数，不需要 tick 值
  const forceUpdate = useCallback(() => {
    setTick((tick) => tick + 1); // 使用回调函数来确保更新基于最新状态
  }, []);

  return forceUpdate; // 返回 forceUpdate 函数
};

export default useForceUpdate;
