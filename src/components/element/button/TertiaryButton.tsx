import { Button } from 'antd';

import TurtleText from '../TurtleText';
import { css } from '@emotion/react';
interface Props {
  text: string;
  icon?: React.ReactNode;

  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
}

function TertiaryButton({ text, icon, ...props }: Props) {
  return (
    <Button css={button} {...props}>
      {icon && <div css={iconContainer}>{icon}</div>}
      <TurtleText>{text}</TurtleText>
    </Button>
  );
}

const button = css`
  width: 160px;
  height: 40px;

  font-weight: 700;
  border: none;
  border-radius: 8px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #00aab5;
  stroke: #00aab5;
  background-color: #ddf3f5;

  &:hover {
    color: #00aab5;
    stroke: #00aab5;
    background-color: #d4e9eb;
  }

  // active 상태
  &.ant-btn:focus {
    color: #00aab5;
    stroke: #00aab5;
    background-color: #ddf3f5;
    border-color: #ddf3f5;
  }

  &.ant-btn[disabled] {
    color: #00aab5;
    stroke: #00aab5;
    background-color: #ddf3f5;
    opacity: 0.5;
  }
`;

const iconContainer = css`
  margin-right: 5px;

  display: flex;
  align-items: center;
`;

export default TertiaryButton;
