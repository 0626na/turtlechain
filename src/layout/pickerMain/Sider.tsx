import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import StoreButton from './StoreButton';

import { ReactComponent as Home } from '@icons/home.svg';
import { ReactComponent as VendorProductIcon } from '@icons/vendorProduct.svg';
import { ReactComponent as OrderIcon } from '@icons/order.svg';
import { ReactComponent as SettingIcon } from '@icons/setting.svg';
import { ReactComponent as TutorialIcon } from '@icons/tutorial.svg';

import { css } from '@emotion/react';

const pathnames = {
  vendor: {
    create: '/picker/vendor/create',
  },

  order: {
    create: '/picker/order/create',
    history: '/picker/order/history',
  },

  etc: {
    setting: '/picker/setting',
    tutorial: '/picker/tutorial',
  },
};

/*
 * mainMenuStyle
 */

const mainMenuContainerStyle = {
  order: -1,
};
const mainMenuTitleStyle = {
  marginTop: 8,
  fontSize: 12,
  color: '#a1a2a6',
};

const mainMenuHomeStyle = {
  fontSize: 12,
  color: '#a1a2a6',
};

const mainMenuContentStyle = {
  fontWeight: 400,
  width: 216,
  height: 38,

  marginLeft: 12,
  paddingLeft: 30,
  borderRadius: 8,
};

const lastMainMenuContentStyle = {
  fontWeight: 400,
  width: 216,
  height: 38,

  marginLeft: 12,
  paddingLeft: 30,
  borderRadius: 8,
  // 마지막 아이템 마진적용
  marginBottom: 40,
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
  fontWeight: 400,
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
        key: 'vendor',
        label: '거래처',
        icon: <VendorProductIcon />,
        style: mainMenuTitleStyle,
        onMouseEnter: (e: info) => {
          e.domEvent.currentTarget.style.color = '#EAECEF';
          e.domEvent.currentTarget.style.backgroundColor = 'transparent';
        },
        onMouseLeave: (e: info) => {
          e.domEvent.currentTarget.style.color = '#a1a2a6';
        },
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
            style: lastMainMenuContentStyle,
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
    setSelectedPath(pathname);
    return;
  }, [pathname]);

  return (
    <Layout.Sider css={siderLayout} width="240" trigger={null}>
      <div css={siderHeader}>
        <StoreButton />
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
  /* window에서도 스크롤바 mac처럼 둥글게 */
  /* total width */
  ::-webkit-scrollbar {
    background-color: #242934;
    width: 13px;
  }

  /* background of the scrollbar except button or resizer */
  ::-webkit-scrollbar-track {
    background-color: #242934;
  }

  /* scrollbar itself */
  ::-webkit-scrollbar-thumb {
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid #242934;
  }

  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
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
