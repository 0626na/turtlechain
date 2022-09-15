import { css } from '@emotion/react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';
import React from 'react';

interface Props extends ButtonProps {
  disabled?: boolean;
}

function AddButton({ children, disabled, ...props }: Props) {
  return (
    <Button disabled={disabled} css={createCodeButton} {...props}>
      <span
        css={[
          createCodeFont,
          {
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {children}
      </span>
    </Button>
  );
}

export default AddButton;

const createCodeButton = css`
  background: #f0f3f6;
  min-width: 100px;
  height: 36px;

  &:hover {
    background-color: #f0f3f6;
  }

  &.ant-btn:focus {
    background-color: #f0f3f6;
    border-color: #f0f3f6;
  }
`;

const createCodeFont = css`
  font-weight: 700;
  color: #6b6d73;
`;
