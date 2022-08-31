import { Button } from 'antd';
import styled from '@emotion/styled';
import TurtleText from '../TurtleText';

interface Props {
  text: string;
  size?: 'default' | 'large';
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
  style?: React.CSSProperties;
}

function PrimaryButton({
  size = 'default',
  text,
  style,
  disabled,
  loading,
  htmlType,
  onClick,
}: Props) {
  if (size === 'large') {
    return (
      <StyledButton
        style={{ width: 512, height: 48, ...style }}
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        htmlType={htmlType}
      >
        <TurtleText>{text}</TurtleText>
      </StyledButton>
    );
  }

  if (size === 'default') {
    return (
      <StyledButton
        style={{ width: 200, height: 40, ...style }}
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        htmlType={htmlType}
      >
        <TurtleText>{text}</TurtleText>
      </StyledButton>
    );
  }

  // 임의 사이즈 적용
  return (
    <StyledButton
      style={style}
      loading={loading}
      onClick={onClick!}
      disabled={disabled}
      htmlType={htmlType!}
    >
      <TurtleText>{text}</TurtleText>
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
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

export default PrimaryButton;
