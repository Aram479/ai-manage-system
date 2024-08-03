import React from 'react';
import './index.less';
import { Outlet } from '@/.umi/exports';

const HeaderLayout: React.FC = (props) => {
  return (
    <div>
      <span>layout</span>
      <Outlet/>
    </div>
  );
};

export default HeaderLayout;
