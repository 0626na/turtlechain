import { Button } from 'antd';

import { TurtleIcon, TurtleText } from '@components/element';
import { css } from '@emotion/react';

interface Props {
  text: string;
  onClick(): void;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
}

function HistoryButton({ text, ...props }: Props) {
  return (
    <Button css={button} {...props}>
      <div css={icon}>
        <TurtleIcon name="list" />
      </div>
      <TurtleText>{text}</TurtleText>
    </Button>
  );
}

const button = css`
  color: #fff;
  margin-left: 20px;
  height: 36px;

  border: none;
  background-color: #141720;

  display: flex;
  align-items: center;

  &:hover {
    background-color: #373a41;
    color: #ffffff;
  }

  // active 상태
  &.ant-btn:focus {
    background-color: #373a41;
    color: #ffffff;
  }
`;

const icon = css`
  margin-right: 8px;
`;

export default HistoryButton;
