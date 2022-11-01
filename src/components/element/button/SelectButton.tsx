import { css } from '@emotion/react';
import { Button } from 'antd';

import React from 'react';

interface Props {
  size?: 'default' | 'large' | 'small';
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function SelectButton({ children, size = 'default', icon, ...props }: Props) {
  return (
    <Button css={[button, sizes[size]]} {...props}>
      {children}
      {icon && <span css={$icon}>{icon}</span>}
    </Button>
  );
}

const sizes = {
  large: css`
    width: 129px;
  `,
  small: css`
    width: 60px;
  `,
  default: css`
    min-width: 88px;
  `,
};

const $icon = css({
  marginLeft: 3,
  lineHeight: 1,
});

const button = css`
  height: 26px;
  font-weight: 500;
  border: none;
  border-radius: 8px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #00aab5;
  background-color: #ddf3f5;
  border-color: #ddf3f5;

  &:hover {
    color: #00aab5;
    border-color: #d4e9eb;
    background-color: #d4e9eb;
  }

  // active 상태
  &.ant-btn:focus {
    color: #00aab5;
    background-color: #ddf3f5;
    border-color: #ddf3f5;
  }
`;

export default SelectButton;
