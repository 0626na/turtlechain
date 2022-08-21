import { Button } from 'antd';
import styled from 'styled-components';

import TurtleText from '../TurtleText';
import { ReactComponent as Plusicon } from '@icon/plus.svg';
interface Props {
  text: string;
  width?: number;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
}

function SecondaryButton({
  text,
  width = 160,
  disabled,
  loading,
  htmlType,
  onClick,
}: Props) {
  const style = {
    width,
  };

  return (
    <StyledButton
      style={style}
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      htmlType={htmlType}
    >
      <Plusicon />
      <TurtleText style={{ marginLeft: 5 }}>{text}</TurtleText>
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  font-weight: 700;

  color: #1a66f9;
  stroke: #1a66f9;
  border-color: #1a66f9;

  &:hover {
    color: #1553ca;
    stroke: #1553ca;
    border-color: #1553ca;
  }

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
