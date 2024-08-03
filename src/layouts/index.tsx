import React from "react";
import "./index.less";
import { NavLink, Outlet } from "@/.umi/exports";

const HeaderLayout: React.FC = (props) => {
  return (
    <div>
        <Outlet />
    </div>
  );
};

export default HeaderLayout;
