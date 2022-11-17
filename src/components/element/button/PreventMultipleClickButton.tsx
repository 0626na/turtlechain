import React from 'react';
import { Button, ButtonProps } from 'antd';

interface Props extends ButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function PreventMultipleClickButton({ loading, children, ...props }: Props) {
  return (
    <Button loading={loading} {...props}>
      {children}
    </Button>
  );
}

export default PreventMultipleClickButton;
