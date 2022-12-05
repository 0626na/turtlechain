import { Layout } from 'antd';

import Sider from './Sider';
import Content from './Content';
import { Navigate, Outlet } from 'react-router-dom';

import useUser from '@hooks/useUser';
import useLogin from '@hooks/useLogin';

function MainLayout() {
  const { user, isStaff } = useUser();
  const { isLogin } = useLogin();

  if (!isLogin) {
    return <Navigate to="/" replace={true} />;
  }

  if (user?.type === 'rt' || isStaff) {
    return <Navigate to="/home" replace={true} />;
  }

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
