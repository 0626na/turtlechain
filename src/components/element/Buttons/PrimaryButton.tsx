import { Button } from 'antd';
import styled from 'styled-components';

interface Props {
  text: string;
  width?: number;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
}

function PrimaryButton({
  text,
  width = 200,
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
      {text}
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  height: 46px;
  font-size: 16px;

  border: none;
  color: #fff;
  background-color: #1a66f9;

  &:hover {
    color: #fff;
    background-color: #1553ca;
  }

  &.ant-btn:focus {
    color: #fff;

    background-color: #1a66f9;
  }
`;

export default PrimaryButton;
