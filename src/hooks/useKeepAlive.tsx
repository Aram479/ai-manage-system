import { FC } from "react";
import KeepAlive from "react-activation";

export const useKeepAlive = <T extends {}>(Component: FC<T>, id = "cmpId") => {
  return (props: T) => {
    return (
      <KeepAlive
        id={id}
        name={id}
        cacheKey={id}
        // when={() => {
        //   /*根据路由的前进和后退状态去判断页面是否需要缓存，前进时缓存，后退时不缓存（卸载）。 when中的代码是在页面离开（卸载）时触发的。*/
        //   return history.action !== 'POP';
        // }}
      >
        <Component {...props} />
      </KeepAlive>
    );
  };
};
