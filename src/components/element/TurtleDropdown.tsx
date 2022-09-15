import { css } from '@emotion/react';

import { Dropdown, Menu } from 'antd';

type MenuInfo = {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
};

type info = {
  key: string;
  domEvent: React.MouseEvent<HTMLElement>;
};

interface Props {
  items: {
    key: string;
    label?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: (e: MenuInfo) => void;
    type?: 'divider';
  }[];
  triggerButton: React.ReactNode;
}

function TurtleDropdown({ items, triggerButton }: Props) {
  const menu = items.map((item) => ({
    ...item,
    icon: item.icon ? <div css={iconMargin}>{item.icon}</div> : '',
    style: item.type === 'divider' ? $divider : menuItem,
    onMouseEnter: (e: info) => {
      e.domEvent.currentTarget.style.backgroundColor = '#EAECEF';
    },
    onMouseLeave: (e: info) => {
      e.domEvent.currentTarget.style.backgroundColor = '#fff';
    },
  }));

  return (
    <Dropdown overlay={<Menu css={$menu} items={menu} />} trigger={['click']}>
      {triggerButton}
    </Dropdown>
  );
}

const $menu = css`
  padding: 6px;
  width: 160px;

  box-shadow: 0px 4px 18px rgba(34, 44, 56, 0.28);
  border-radius: 8px;
`;

const iconMargin = css`
  margin-right: 4px;
`;

const menuItem = {
  borderRadius: 6,
  height: 34,
};

const $divider = {
  margin: '6px 0px',
  background: '#EBEBEE',
};

export default TurtleDropdown;
