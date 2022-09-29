import { Button } from 'antd';

import TurtleText from '../TurtleText';
import { css } from '@emotion/react';

interface Props {
  size?: 'default' | 'large' | 'small';
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit' | 'button';
  href?: string;
  target?: string;
  onClick?: () => void;
}

function PrimaryButton({
  size = 'default',
  children,
  htmlType = 'button',
  ...props
}: Props) {
  if (size === 'large') {
    return (
      <Button css={largePrimary} htmlType={htmlType} {...props}>
        <TurtleText>{children}</TurtleText>
      </Button>
    );
  }

  if (size === 'small') {
    return (
      <Button css={smallPrimary} htmlType={htmlType} {...props}>
        <TurtleText>{children}</TurtleText>
      </Button>
    );
  }

  // default
  return (
    <Button css={defaultPrimary} htmlType={htmlType} {...props}>
      <TurtleText>{children}</TurtleText>
    </Button>
  );
}

const button = css`
  font-size: 16px;
  font-weight: 500;

  border: none;
  color: #fff;
  background-color: #1a66f9;

  &:hover {
    color: #fff;
    background-color: #1553ca;
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;
    background-color: #1a66f9;
  }
`;

const defaultPrimary = css([button, { width: 200, height: 48 }]);
const largePrimary = css([button, { width: 512, height: 48 }]);
const smallPrimary = css([button, { width: 140, height: 36, fontSize: 14 }]);

export default PrimaryButton;
