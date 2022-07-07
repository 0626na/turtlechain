import { useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sider from './Sider';
import Content from './Content';
import { Navigate, Outlet } from 'react-router-dom';
import { useLogin } from '@hooks/index';

function MainLayout() {
  const { isLogin } = useLogin();
  const [menuVisible, setMenuVisible] = useState(false);

  if (!isLogin) {
    return <Navigate to="/" replace={true} />;
  }

  const handleMenuVisible = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <Layout>
      <Header handleMenuVisible={handleMenuVisible} />
      <Layout>
        <Sider collapsed={menuVisible} />
        <Content menuVisible={menuVisible}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
