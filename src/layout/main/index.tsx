import { Layout } from 'antd';

import Sider from './Sider';
import Content from './Content';
import { Outlet } from 'react-router-dom';

function MainLayout() {
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
