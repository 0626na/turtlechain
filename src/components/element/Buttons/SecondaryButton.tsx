import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styled from 'styled-components';
import TurtleImg from '../TurtleImg';

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
      disabled={true}
      htmlType={htmlType}
      icon={<PlusOutlined />}
    >
      <span style={{ marginLeft: 5 }}>{text}</span>
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  height: 40px;
  background-color: transparent;
  border-color: #1a66f9;
  color: #1a66f9;

  &:hover {
    color: #1553ca;
    border-color: #1553ca;
  }
`;

export default SecondaryButton;
