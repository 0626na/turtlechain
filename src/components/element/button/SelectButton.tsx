import { css } from '@emotion/react';
import { Button } from 'antd';

import React from 'react';

interface Props {
  size?: 'default' | 'large' | 'small';
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: any) => void;
}

function SelectButton({ children, size = 'default', icon, ...props }: Props) {
  if (size === 'large') {
    return (
      <Button css={[button, { width: 129 }]} {...props}>
        {children}
        {icon && <div>{icon}</div>}
      </Button>
    );
  }

  if (size === 'small') {
    return (
      <Button css={[button, { width: 60 }]} {...props}>
        {children}
        {icon && <div>{icon}</div>}
      </Button>
    );
  }

  return (
    <Button css={[button, { width: 88 }]} {...props}>
      {children}
      {icon && <div>{icon}</div>}
    </Button>
  );
}

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
