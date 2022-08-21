import { Button } from 'antd';
import styled from 'styled-components';
import TurtleText from '../TurtleText';

interface Props {
  text: string;
  type?: 'YES' | 'NO';
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
  style?: React.CSSProperties;
}

function AnswerButton({
  text,
  type = 'YES',
  style,
  disabled,
  loading,
  htmlType,
  onClick,
}: Props) {
  if (type === 'NO') {
    return (
      <FalsyButton
        style={{ width: 66, height: 36, ...style }}
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        htmlType={htmlType}
      >
        <TurtleText>{text}</TurtleText>
      </FalsyButton>
    );
  }

  // type === YES
  return (
    <TruthyButton
      style={{ width: 66, height: 36, ...style }}
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      htmlType={htmlType}
    >
      <TurtleText>{text}</TurtleText>
    </TruthyButton>
  );
}

const FalsyButton = styled(Button)`
  font-weight: 500;
  color: #6b6d73;
  background-color: #f0f3f6;

  &:hover {
    color: #6b6d73;
    background-color: #d9dbde;
  }

  // active 상태
  &.ant-btn:focus {
    color: #6b6d73;
    background-color: #f0f3f6;
  }
`;

const TruthyButton = styled(Button)`
  font-weight: 500;
  color: #ffffff;
  background-color: #1a66f9;

  &:hover {
    color: #ffffff;
    background-color: #1553ca;
  }

  // active 상태
  &.ant-btn:focus {
    color: #ffffff;
    background-color: #1a66f9;
  }

  &.ant-btn[disabled] {
    color: #ffffff;
    background: #1a66f9;
    opacity: 0.6;
  }
`;

export default AnswerButton;
