import styled from 'styled-components';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import StoreSelector from './StoreSelector';

import { TurtleImg } from '@components/element';
import TurtleDivider from '@components/element/TurtleDivider';

import { ReactComponent as VendorProductIcon } from '@icons/vendorProduct.svg';
import { ReactComponent as OrderIcon } from '@icons/order.svg';
import { ReactComponent as WarehousingIcon } from '@icons/warehousing.svg';
import { ReactComponent as ClearingIcon } from '@icons/clearing.svg';
import { ReactComponent as SettingIcon } from '@icons/setting.svg';
import { ReactComponent as TutorialIcon } from '@icons/tutorial.svg';

// mainMenus, settingMenus가 컴포넌트 밖에서 선언되어있기때문에 선언순서에 영향을 받는다.
const MenuTitleText = styled.span`
  font-size: 12px;
  color: #a1a2a6;
`;
const MenuContnetText = styled.span`
  font-weight: 500;
`;

const mainMenus = [
  {
    key: '/vendor&product',
    label: <MenuTitleText>{'거래처/상품'}</MenuTitleText>,
    icon: <VendorProductIcon />,
    children: [
      {
        key: '/vendor/create',
        label: <MenuContnetText>{t('vendor.create')}</MenuContnetText>,
      },
      {
        key: '/product/create',
        label: <MenuContnetText>{t('product.create')}</MenuContnetText>,
      },
    ],
  },
  {
    key: '/order',
    label: <MenuTitleText>{t('order.')}</MenuTitleText>,
    icon: <OrderIcon />,
    children: [
      {
        key: '/order/create',
        label: <MenuContnetText>{t('order.create')}</MenuContnetText>,
      },
      {
        key: '/order/history',
        label: <MenuContnetText>{t('order.history')}</MenuContnetText>,
      },
    ],
  },
  {
    key: '/warehousing',
    label: <MenuTitleText>{t('warehousing.')}</MenuTitleText>,
    icon: <WarehousingIcon />,
    children: [
      {
        key: '/warehousing/create',
        label: <MenuContnetText>{t('warehousing.create')}</MenuContnetText>,
      },
      {
        key: '/warehousing/history',
        label: <MenuContnetText>{t('warehousing.history')}</MenuContnetText>,
      },
      {
        key: '/warehousing/adjustment',
        label: <MenuContnetText>{t('warehousing.adjustment')}</MenuContnetText>,
      },
    ],
  },
  {
    key: '/clearing',
    label: <MenuTitleText>{t('clearing.')}</MenuTitleText>,
    icon: <ClearingIcon />,
    children: [
      {
        key: '/clearing/create',
        label: t('clearing.create'),
      },
      {
        key: '/clearing/history',
        label: t('clearing.history'),
      },
      {
        key: '/clearing/trade',
        label: t('clearing.trade'),
      },
    ],
  },
];

const etcMenus = [
  {
    key: '/setting',
    label: <MenuContnetText>{t('etc.setting')}</MenuContnetText>,
    icon: <SettingIcon />,
  },
  {
    key: '/tutorial',
    label: <MenuContnetText>{t('etc.tutorial')}</MenuContnetText>,
    icon: <TutorialIcon />,
  },
];

function Sider() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // const [openKeys, setOpenKeys] = useState<string[]>([]);
  // const [selectedKeys, selectKeys] = useState(pathname);

  // pathname 이용하여 주소 바뀔 시 메뉴 선택
  useEffect(() => {
    console.log(pathname);
    console.log(pathname.split('/'));

    // const [, firstKey, secondKey] = pathname.split('/');
    // if (firstKey === 'home') {
    //   setOpenKeys([]);
    //   selectKeys('/home');
    //   return;
    // }

    // setOpenKeys([`/${firstKey}`]);
    // selectKeys(`/${firstKey}/${secondKey}`);
  }, [pathname]);

  return (
    <Layout.Sider
      style={{ height: '100vh' }}
      width="260"
      trigger={null}

      // collapsible
      // collapsed={false}
    >
      <SiderHeader>
        <LogoContainer
          onClick={() => {
            navigate('home');
          }}
        >
          <TurtleImg name="logo" />
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
            inlineIndent={20}
            items={mainMenus}
            defaultOpenKeys={mainMenus.map((subMenu) => subMenu.key)}
            // defaultSelectedKeys={['/home']}
            onSelect={({ key }) => {
              navigate(key);
            }}
            // openKeys={openKeys}
            onOpenChange={(openKeys) => {
              // setOpenKeys([openKeys.pop() ?? '']);
            }}
            // selectedKeys={[selectedKeys]}
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
            items={etcMenus}
            theme="dark"
            mode="inline"
            inlineIndent={20}
            // openKeys={openKeys}
            // onOpenChange={(openKeys) => {
            //   setOpenKeys([openKeys.pop() ?? '']);
            // }}
            // selectedKeys={[selectedKeys]}
            onSelect={({ key }) => {
              navigate(key);
            }}
          />
          {/* {etcMenus.map(({ key, label }) => (
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

  cursor: pointer;
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
