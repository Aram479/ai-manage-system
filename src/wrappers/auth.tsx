import { Navigate, Outlet, useLocation } from "@umijs/max";
import localCache from "@/utils/cache";

const AuthWrapper: React.FC = (AAA) => {
  const location = useLocation();
  const token = localCache.getItem("token");

  // 如果已登录
  if (token) {
    // 已登录用户不能访问登录页，重定向到默认页
    if (location.pathname === "/Login") {
      return <Navigate to="/" replace />;
    }
    // 已登录且不在登录页，正常渲染子路由
    return <Outlet />;
  }

  // 如果未登录且不在登录页，重定向到登录页
  if (location.pathname !== "/Login") {
    return <Navigate to="/Login" replace />;
  }

  // 如果未登录且已在登录页，渲染登录页
  return <Outlet />;
};

export default AuthWrapper;
