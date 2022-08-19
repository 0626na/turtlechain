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
      type="primary"
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
  background-color: #1a66f9;

  &:hover {
    background-color: #1553ca;
  }
`;

export default PrimaryButton;
