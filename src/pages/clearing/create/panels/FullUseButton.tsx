import { TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';
import React from 'react';

interface Props extends ButtonProps {
  disabled?: boolean;
}

function FullUseButton({ icon, children, disabled, ...props }: Props) {
  return (
    <Button disabled={disabled} css={buttonCss.self} {...props}>
      <span css={buttonCss.icon}>
        <TurtleIcon name="coin" />
      </span>

      <span
        css={buttonCss.text}
        style={{
          ['--opacity' as any]: disabled ? 0.5 : 1,
        }}
      >
        {children}
      </span>
    </Button>
  );
}

export default FullUseButton;

const buttonCss = {
  self: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#f0f3f6',
    width: 94,
    height: 28,

    '&:hover': {
      backgroundColor: '#D9DBDE',
    },

    '&.ant-btn:focus': {
      backgroundColor: '#f0f3f6',
      borderColor: '#f0f3f6',
    },

    //disabled
    '&.ant-btn[disabled]': {
      opacity: 0.5,
    },
  },

  icon: css({ marginRight: 4 }),

  text: css({
    fontWeight: 700,
    color: '#6b6d73',
    opacity: 'var(--opacity)',
  }),
};
