import { Button } from 'antd';
import styled from 'styled-components';

import TurtleText from '../TurtleText';
import { ReactComponent as Plusicon } from '@icons/plus.svg';
import { css } from '@emotion/react';
interface Props {
  text: string;
  size?: 'default' | 'large';
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
  style?: React.CSSProperties;
}

function SecondaryButton({
  size = 'default',
  text,
  disabled,
  loading,
  htmlType,
  onClick,
  style,
}: Props) {
  if (size === 'default') {
    return (
      <StyledButton
        style={{ width: 160, height: 40, ...style }}
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        htmlType={htmlType}
      >
        <Plusicon />
        <TurtleText
          css={css`
            margin-left: 5px;
          `}
        >
          {text}
        </TurtleText>
      </StyledButton>
    );
  }

  // 임의 사이즈 적용
  return (
    <StyledButton
      style={style}
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      htmlType={htmlType}
    >
      <Plusicon />
      <TurtleText
        css={css`
          margin-left: 5px;
        `}
      >
        {text}
      </TurtleText>
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
