import { Button } from 'antd';
import { TFunctionResult } from 'i18next';

interface Props {
  children: TFunctionResult;
  type?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
}

function TurtleButton({
  children,
  type = 'primary',
  disabled = false,
  loading,
  htmlType,
  onClick,
}: Props) {
  return (
    <Button
      type={type === 'default' ? 'default' : 'primary'}
      size="large"
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      style={{
        width: '160px',
        backgroundColor: type === 'secondary' ? '#13BC9E' : '',
        borderColor: type === 'secondary' ? '#13BC9E' : '',
        border: disabled ? 'none' : '',
      }}
      htmlType={htmlType}
    >
      {children}
    </Button>
  );
}

export default TurtleButton;
