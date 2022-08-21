import { Button } from 'antd';
import styled from 'styled-components';

import TurtleText from '../TurtleText';
interface Props {
  text: string;
  size?: 'default';
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  icon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

function TeriaryButton({
  size = 'default',
  text,
  icon,
  loading,
  disabled,
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
        {icon && <IconContainer>{icon}</IconContainer>}
        <TurtleText>{text}</TurtleText>
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
      {icon && <IconContainer>{icon}</IconContainer>}
      <TurtleText>{text}</TurtleText>
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
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
  }

  &.ant-btn[disabled] {
    color: #00aab5;
    stroke: #00aab5;
    background-color: #ddf3f5;
    opacity: 0.5;
  }
`;

const IconContainer = styled.div`
  margin-right: 5px;

  display: flex;
  align-items: center;
`;
export default TeriaryButton;
