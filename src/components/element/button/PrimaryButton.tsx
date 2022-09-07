import { Button } from 'antd';

import TurtleText from '../TurtleText';
import { css } from '@emotion/react';

interface Props {
  size?: 'default' | 'large';
  text: string;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
}

function PrimaryButton({ size = 'default', text, ...props }: Props) {
  if (size === 'large') {
    return (
      <Button css={largePrimary} {...props}>
        <TurtleText>{text}</TurtleText>
      </Button>
    );
  }

  // default
  return (
    <Button css={defaultPrimary} {...props}>
      <TurtleText>{text}</TurtleText>
    </Button>
  );
}

const button = css`
  font-size: 16px;
  font-weight: 700;

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

const defaultPrimary = css([button, { width: 200, height: 40 }]);
const largePrimary = css([button, { width: 512, height: 48 }]);

export default PrimaryButton;
