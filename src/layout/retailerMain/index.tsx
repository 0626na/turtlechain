import { Layout } from 'antd';

import Sider from './Sider';
import Content from './Content';
import { Navigate, Outlet } from 'react-router-dom';
// import PickerSider from './PickerSider';
import useUser from '@hooks/useUser';
import useLogin from '@hooks/useLogin';

function MainLayout() {
  const { user } = useUser();
  const { isLogin } = useLogin();

  if (!isLogin) {
    return <Navigate to="/" replace={true} />;
  }

  if (user.type === 'pi') {
    return <Navigate to="/picker/vendor" replace={true} />;
  }

  return (
    <Layout css={{ minWidth: 1500 }}>
      <Sider />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default MainLayout;
