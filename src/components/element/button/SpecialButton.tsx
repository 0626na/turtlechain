import { css } from '@emotion/react';
import { Button } from 'antd';
import TurtleText from '../TurtleText';

import TurtleIcon from '../icon/TurtleIcon';
interface Props {
  size?: 'default' | 'large';
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit' | 'button';
  icon?: React.ReactNode;
  onClick?: () => void;
}

function SpecialButton({
  children,
  htmlType = 'button',
  size = 'default',
  ...props
}: Props) {
  if (size === 'large') {
    return (
      <Button css={largeSpecial} htmlType={htmlType} {...props}>
        <TurtleText>{children}</TurtleText>
      </Button>
    );
  }

  return (
    <Button css={defaultSpecial} htmlType={htmlType} {...props}>
      <div css={icon}>
        <TurtleIcon name="plus" />
      </div>
      <TurtleText>{children}</TurtleText>
    </Button>
  );
}

const icon = css`
  margin-right: 5px;
`;

const button = css`
  width: 160px;
  height: 40px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  font-weight: 700;

  color: #fff;
  stroke: #fff;
  background: linear-gradient(90deg, #00be90 0%, #00b3be 77.08%, #00b3be 100%);

  &:hover {
    color: #fff;
    border-color: linear-gradient(
      90deg,
      #00be90 0%,
      #00b3be 77.08%,
      #00b3be 100%
    );

    background: linear-gradient(
      90deg,
      #009773 0%,
      #008f98 77.08%,
      #008f98 100%
    );
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;
    stroke: #fff;

    background: linear-gradient(
      90deg,
      #00be90 0%,
      #00b3be 77.08%,
      #00b3be 100%
    );
  }
`;

const defaultSpecial = css([button, { width: 160, height: 40 }]);

const largeSpecial = css([button, { width: 512, height: 48 }]);

export default SpecialButton;
