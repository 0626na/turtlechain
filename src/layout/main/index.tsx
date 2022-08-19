import { useState } from 'react';
import { Layout } from 'antd';

import Sider from './sider/Sider';
import Content from './Content';
import { Navigate, Outlet } from 'react-router-dom';
import { useLogin } from '@hooks/index';

function MainLayout() {
  const { isLogin } = useLogin();

  // if (!isLogin) {
  //   return <Navigate to="/" replace={true} />;
  // }

  return (
    <Layout>
      <Sider />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default MainLayout;
