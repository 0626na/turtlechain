import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import StoreSelector from './StoreSelector';

import { ReactComponent as Home } from '@icons/home.svg';
import { ReactComponent as VendorProductIcon } from '@icons/vendorProduct.svg';
import { ReactComponent as OrderIcon } from '@icons/order.svg';
import { ReactComponent as WarehousingIcon } from '@icons/warehousing.svg';
import { ReactComponent as ClearingIcon } from '@icons/clearing.svg';
import { ReactComponent as SettingIcon } from '@icons/setting.svg';
import { ReactComponent as TutorialIcon } from '@icons/tutorial.svg';
import { css } from '@emotion/react';

const pathnames = {
  vendor: {
    create: 'vendor/create',
  },

  product: {
    create: 'product/create',
  },

  order: {
    create: 'order/create',
    history: 'order/history',
  },

  warehousing: {
    create: 'warehousing/create',
    history: 'warehousing/history',
    adjustment: 'warehousing/adjustment',
  },

  clearing: {
    create: 'clearing/create',
    history: 'clearing/history',
    trade: 'clearing/trade',
  },

  etc: {
    setting: 'setting',
    tutorial: 'tutorial',
  },
};

/*
 * mainMenuStyle
 */

const mainMenuContainerStyle = {
  order: -1,
};
const mainMenuTitleStyle = {
  fontSize: 12,
  color: '#a1a2a6',
};

const mainMenuHomeStyle = {
  fontSize: 12,
  color: '#a1a2a6',
};

const mainMenuContentStyle = {
  fontWeight: 500,
  width: 216,
  height: 38,

  marginLeft: 12,
  paddingLeft: 30,
  borderRadius: 8,
};

/*
 * etcMenuStyle :
 */

const etcMenuContainerStyle = {
  order: 1,
  padding: '16px 0px 20px 12px',
  borderTop: 'solid #434852 1px', // divider
};
const etcMenuTitleStyle = {
  fontWeight: 500,
  width: 216,
  height: 38,

  padding: '0px 8px',
  borderRadius: 8,
};

/*
 * menus
 */

type info = {
  key: string;
  domEvent: React.MouseEvent<HTMLElement>;
};

const menus = [
  {
    type: 'group',
    key: 'mainMenuContainer',
    style: mainMenuContainerStyle,
    children: [
      {
        key: 'home',
        label: '홈',
        icon: <Home />,
        style: mainMenuHomeStyle,
        onMouseEnter: (e: info) => {
          e.domEvent.currentTarget.style.color = '#EAECEF';
          e.domEvent.currentTarget.style.backgroundColor = 'transparent';
        },
        onMouseLeave: (e: info) => {
          e.domEvent.currentTarget.style.color = '#a1a2a6';
        },
      },
      {
        key: 'vendor&product',
        label: '거래처/상품',
        icon: <VendorProductIcon />,
        style: mainMenuTitleStyle,
        children: [
          {
            key: pathnames.vendor.create,
            label: t('vendor.create'),
            style: mainMenuContentStyle,
          },
          {
            key: pathnames.product.create,
            label: t('product.create'),
            style: mainMenuContentStyle,
          },
        ],
      },
      {
        key: 'order',
        label: t('order.'),
        icon: <OrderIcon />,
        style: mainMenuTitleStyle,
        children: [
          {
            key: pathnames.order.create,
            label: t('order.create'),
            style: mainMenuContentStyle,
          },
          {
            key: pathnames.order.history,
            label: t('order.history'),
            style: mainMenuContentStyle,
          },
        ],
      },
      {
        key: 'warehousing',
        label: t('warehousing.'),
        icon: <WarehousingIcon />,
        style: mainMenuTitleStyle,
        children: [
          {
            key: pathnames.warehousing.create,
            label: t('warehousing.create'),
            style: mainMenuContentStyle,
          },
          {
            key: pathnames.warehousing.history,
            label: t('warehousing.history'),
            style: mainMenuContentStyle,
          },
          {
            key: pathnames.warehousing.adjustment,
            label: t('warehousing.adjustment'),
            style: mainMenuContentStyle,
          },
        ],
      },
      {
        key: 'clearing',
        label: t('clearing.'),
        icon: <ClearingIcon />,
        style: mainMenuTitleStyle,
        children: [
          {
            key: pathnames.clearing.create,
            label: t('clearing.create'),
            style: mainMenuContentStyle,
          },
          {
            key: pathnames.clearing.history,
            label: t('clearing.history'),
            style: mainMenuContentStyle,
          },
          {
            key: pathnames.clearing.trade,
            label: t('clearing.trade'),
            style: mainMenuContentStyle,
          },
        ],
      },
    ],
  },
  {
    type: 'group',
    key: 'etcMenuContainer',
    style: etcMenuContainerStyle,
    children: [
      {
        key: pathnames.etc.setting,
        label: t('etc.setting'),
        icon: <SettingIcon />,
        style: etcMenuTitleStyle,
      },
      {
        key: pathnames.etc.tutorial,
        label: t('etc.tutorial'),
        icon: <TutorialIcon />,
        style: etcMenuTitleStyle,
      },
    ],
  },
];

function Sider() {
  // pathname필드, seelectedPath상태는 사이드바에서 메뉴를 직접 클릭하는방식이 아닌,
  // 페이지내에서 다른 메뉴의 페이지로 이동할때 사용된다.
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selectedPath, setSelectedPath] = useState('');

  useEffect(() => {
    const [, firstPath, secondPath] = pathname.split('/');
    if (firstPath === ('setting' || 'tutorial')) {
      setSelectedPath(firstPath);
      return;
    }

    setSelectedPath(firstPath + '/' + secondPath);
  }, [pathname]);

  return (
    <Layout.Sider css={siderLayout} width="240" trigger={null}>
      <div css={siderHeader}>
        <StoreSelector />
      </div>

      <Menu
        css={menu}
        theme="dark"
        mode="inline"
        inlineIndent={20} // ==== padding-left : 20px;
        items={menus}
        defaultOpenKeys={menus.flatMap((group) =>
          group.children.map((subMenu) => subMenu.key),
        )}
        selectedKeys={[selectedPath]}
        onSelect={({ key }) => {
          navigate(key);
        }}
      />
    </Layout.Sider>
  );
}

const siderLayout = css`
  & > div {
    // Sider의 children 선택자.
    height: 100vh;
    display: flex;

    flex-direction: column;
  }
`;

const siderHeader = css`
  height: 100px;
  padding: 20px 12px;

  display: flex;
  flex-direction: column;
`;

const menu = css`
  flex-grow: 1;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // mainMenuTitle 높이 설정.
  .ant-menu-submenu-title {
    height: 36px;
  }

  // group-menu중 antd에서 기본으로 제공하는 title의  패딩값 제거.
  .ant-menu-item-group-title {
    padding: 0;
  }
`;

export default Sider;
