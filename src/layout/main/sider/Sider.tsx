import styled from 'styled-components';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Divider, Dropdown, Layout, Menu, Row, Space, Typography } from 'antd';
import { TurtleImg } from '@components/element';
import StoreSelector from './StoreSelector';
import TurtleDivider from '@components/element/TurtleDivider';

const mainMenus = [
  {
    key: '/vendor&product',
    title: '거래처/상품',
    submenus: [
      {
        title: t('vendor.create'),
        pathname: '/vendor/create',
      },
      {
        title: t('product.create'),
        pathname: '/product/create',
      },
    ],
  },
  {
    key: '/order',
    title: t('order.'),
    submenus: [
      {
        title: t('order.create'),
        pathname: '/order/create',
      },
      {
        title: t('order.list'),
        pathname: '/order/list',
      },
    ],
  },
  {
    key: '/warehousing',
    title: t('warehousing.'),
    submenus: [
      {
        title: t('warehousing.create'),
        pathname: '/warehousing/create',
      },
      {
        title: t('warehousing.list'),
        pathname: '/warehousing/list',
      },
      {
        title: t('adjustment.'),
        pathname: '/adjustment',
      },
    ],
  },

  {
    key: '/clearing',
    title: t('clearing.'),
    submenus: [
      {
        title: t('clearing.create'),
        pathname: '/clearing/create',
      },
      {
        title: t('clearing.list'),
        pathname: '/clearing/list',
      },
      {
        title: t('clearing.balance'),
        pathname: '/clearing/balance',
      },
    ],
  },
];

const settingMenus = [
  {
    key: '/setting',
    title: t('setting'),
  },
  {
    key: '/tutorial',
    title: t('tutorial'),
  },
];

function Sider() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, selectKeys] = useState(pathname);

  // pathname 이용하여 주소 바뀔 시 메뉴 선택
  useEffect(() => {
    const [, firstKey, secondKey] = pathname.split('/');
    if (firstKey === 'home') {
      setOpenKeys([]);
      selectKeys('/home');
      return;
    }

    setOpenKeys([`/${firstKey}`]);
    selectKeys(`/${firstKey}/${secondKey}`);
  }, [pathname]);

  return (
    <Layout.Sider
      style={{ height: '100vh' }}
      width="260"
      trigger={null}
      collapsible
      collapsed={false}
    >
      <SiderHeader>
        <LogoContainer>
          <div>
            <TurtleImg name="logo" />
          </div>
        </LogoContainer>

        <StoreSelectorContainer>
          <StoreSelector />
        </StoreSelectorContainer>
      </SiderHeader>

      <SiderContentContainer>
        <MainMenuInner>
          <Menu
            theme="dark"
            mode="inline"
            openKeys={openKeys}
            onOpenChange={(openKeys) => {
              setOpenKeys([openKeys.pop() ?? '']);
            }}
            selectedKeys={[selectedKeys]}
            onSelect={({ key }) => {
              navigate(key);
            }}
          >
            {mainMenus.map(({ key, title, submenus }) => (
              <Menu.SubMenu
                key={key}
                title={
                  <Typography.Text
                    style={{
                      fontSize: 12,
                      color: '#A1A2A6',
                    }}
                  >
                    {title}
                  </Typography.Text>
                }
                icon={<div>{<TurtleImg name={key.substring(1)} />}</div>}
              >
                {submenus.map((submenu) => (
                  <Menu.Item
                    style={{
                      borderRadius: 8,
                      paddingLeft: 42,
                      width: 236,
                      marginLeft: 12,
                    }}
                    key={submenu.pathname}
                  >
                    {submenu.title}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ))}
          </Menu>
        </MainMenuInner>

        <SettingMenuInner style={{ height: '11%' }}>
          <TurtleDivider color={`#434852`} />
          <Menu
            theme="dark"
            mode="inline"
            openKeys={openKeys}
            onOpenChange={(openKeys) => {
              setOpenKeys([openKeys.pop() ?? '']);
            }}
            selectedKeys={[selectedKeys]}
            onSelect={({ key }) => {
              navigate(key);
            }}
          >
            {settingMenus.map(({ key, title }) => (
              <Menu.Item
                key={key}
                icon={<div>{<TurtleImg name={key.substring(1)} />}</div>}
              >
                {title}
              </Menu.Item>
            ))}
          </Menu>
        </SettingMenuInner>
      </SiderContentContainer>
    </Layout.Sider>
  );
}

const SiderHeader = styled.div`
  height: 142px;

  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  margin-left: 28px;
  height: 82px;

  display: flex;
  align-items: center;
`;

const StoreSelectorContainer = styled.div`
  margin: 0px 12px;
`;

const SiderContentContainer = styled.div`
  height: 82%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MainMenuInner = styled.div``;

const SettingMenuInner = styled.div``;

export default Sider;
