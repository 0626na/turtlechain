import React from 'react';
import { Button, ButtonProps } from 'antd';

interface Props extends ButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * 버튼 클릭시 동작하는 로직이 실행되는 도중에 또 다시 클릭하여 여러번 반복되지 않도록 하기 위한 중복클릭 방지 버튼
 * @param loading 버튼 클릭시, 클릭한 동작이 진행되는 것을 표시
 * @param children 버튼안에 쓰여질 내용
 * @returns button
 */
function PreventMultipleClickButton({ loading, children, ...props }: Props) {
  return (
    <Button loading={loading} {...props}>
      {children}
    </Button>
  );
}

export default PreventMultipleClickButton;
