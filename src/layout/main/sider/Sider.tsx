import styled from 'styled-components';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { TurtleImg, TurtleText } from '@components/element';
import StoreSelector from './StoreSelector';
import TurtleDivider from '@components/element/TurtleDivider';
import { ReactComponent as VendorProductIcon } from '@icons/vendorProduct.svg';
import { ReactComponent as OrderIcon } from '@icons/order.svg';
import { ReactComponent as WarehousingIcon } from '@icons/warehousing.svg';
import { ReactComponent as ClearingIcon } from '@icons/clearing.svg';
import { ReactComponent as SettingIcon } from '@icons/setting.svg';
import { ReactComponent as TutorialIcon } from '@icons/tutorial.svg';

const mainMenus = [
  {
    key: '/vendor&product',
    label: (
      <TurtleText style={{ fontSize: 12, color: '#A1A2A6' }}>
        {'거래처/상품'}
      </TurtleText>
    ),
    icon: <VendorProductIcon />,
    children: [
      {
        key: '/vendor/create',
        label: (
          <TurtleText
            style={{
              fontWeight: 500,
            }}
          >
            {t('vendor.create')}
          </TurtleText>
        ),
      },
      {
        key: '/product/create',
        label: (
          <TurtleText style={{ fontWeight: 500 }}>
            {t('product.create')}
          </TurtleText>
        ),
      },
    ],
  },
  {
    key: '/order',
    label: (
      <TurtleText style={{ fontSize: 12, color: '#A1A2A6' }}>
        {t('order.')}
      </TurtleText>
    ),
    icon: <OrderIcon />,
    children: [
      {
        key: '/order/create',
        label: (
          <TurtleText
            style={{
              fontWeight: 500,
            }}
          >
            {t('order.create')}
          </TurtleText>
        ),
      },
      {
        key: '/order/history',
        label: (
          <TurtleText
            style={{
              fontWeight: 500,
            }}
          >
            {t('order.history')}
          </TurtleText>
        ),
      },
    ],
  },
  {
    key: '/warehousing',
    label: (
      <TurtleText style={{ fontSize: 12, color: '#A1A2A6' }}>
        {t('warehousing.')}
      </TurtleText>
    ),
    icon: <WarehousingIcon />,
    children: [
      {
        key: '/warehousing/create',
        label: (
          <TurtleText
            style={{
              fontWeight: 500,
            }}
          >
            {t('warehousing.create')}
          </TurtleText>
        ),
      },
      {
        key: '/warehousing/history',
        label: (
          <TurtleText
            style={{
              fontWeight: 500,
            }}
          >
            {t('warehousing.history')}
          </TurtleText>
        ),
      },
      {
        key: '/warehousing/adjustment',
        label: (
          <TurtleText
            style={{
              fontWeight: 500,
            }}
          >
            {t('warehousing.adjustment')}
          </TurtleText>
        ),
      },
    ],
  },
  {
    key: '/clearing',
    label: (
      <TurtleText style={{ fontSize: 12, color: '#A1A2A6' }}>
        {t('clearing.')}
      </TurtleText>
    ),
    icon: <ClearingIcon />,
    children: [
      {
        key: '/clearing/create',
        label: t('clearing.create'),
      },
      {
        key: '/clearing/list',
        label: t('clearing.list'),
      },
      {
        key: '/clearing/balance',
        label: t('clearing.balance'),
      },
    ],
  },
];

const settingMenus = [
  {
    key: '/setting',
    label: t('setting'),
    icon: <SettingIcon />,
  },
  {
    key: '/tutorial',
    label: t('tutorial'),
    icon: <TutorialIcon />,
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
          <TurtleImg name="logo" />
        </LogoContainer>

        <StoreSelectorContainer>
          <StoreSelector />
        </StoreSelectorContainer>
      </SiderHeader>

      <SiderContentContainer>
        <MainMenuInner>
          <Menu
            items={mainMenus}
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
          />
          {/* {mainMenus.map(({ key, title, submenus }) => (
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
            ))} */}
          {/* </Menu> */}
        </MainMenuInner>

        <SettingMenuInner style={{ height: '11%' }}>
          <TurtleDivider color={`#434852`} />
          <Menu
            // style={{ color: 'red' }}
            items={settingMenus}
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
          />
          {/* {settingMenus.map(({ key, label }) => (
              <Menu.Item
                key={key}
                icon={<div>{<TurtleImg name={key.substring(1)} />}</div>}
              >
                {label}
              </Menu.Item>
            ))} */}
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
  /* width: 200px; */
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
