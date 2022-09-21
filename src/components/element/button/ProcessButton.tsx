import { css } from '@emotion/react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';

import React from 'react';
import TurtleIcon from '../icon/TurtleIcon';

interface Props extends ButtonProps {
  children: React.ReactNode;
}

function ProcessButton({ children, ...props }: Props) {
  return (
    <Button {...props} css={button}>
      {children}
      <div css={{ marginLeft: 3 }}>
        <TurtleIcon name="process" />
      </div>
    </Button>
  );
}

const button = css`
  width: 88px;
  height: 26px;

  font-weight: 500;
  border-radius: 8px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #fff;

  background-color: #00b3be;

  &:hover {
    color: #fff;

    background-color: #009ea8;
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;
    background-color: #009ea8;
    border-color: #009ea8;
  }
`;
export default ProcessButton;
