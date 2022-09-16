import { css } from '@emotion/react';
import { Button } from 'antd';
import TurtleText from '../TurtleText';
import { ReactComponent as Plusicon } from '@icons/plus.svg';
import { ButtonProps } from 'antd/es/button';
interface Props extends ButtonProps {
  children: React.ReactNode;
  htmlType?: 'submit';
}

function SecondaryButton({ children, ...props }: Props) {
  return (
    <Button css={button} {...props}>
      <Plusicon css={icon} />
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

  color: #1a66f9;
  stroke: #1a66f9;
  border: 1px solid #1a66f9;

  &:hover {
    color: #1553ca;
    stroke: #1553ca;
    border-color: #1553ca;
  }

  // active 상태
  &.ant-btn:focus {
    color: #1a66f9;
    stroke: #1a66f9;
    border-color: #1a66f9;
  }

  &.ant-btn[disabled] {
    background: #ffffff;

    color: #babcc0;
    stroke: #babcc0;
    border-color: #babcc0;
  }
`;

export default SecondaryButton;
