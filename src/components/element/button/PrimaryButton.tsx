import { Button } from 'antd';

import TurtleText from '../TurtleText';
import { css } from '@emotion/react';

const sizeCss = {
  small: {
    width: '138px',
    height: '36px',
    fontSize: '14px',
    background: '#1a66f9',
    hoverColor: '#1553ca',
  },

  default: {
    width: '200px',
    height: '46px',
    fontSize: '16px',
    background:
      'linear-gradient(90deg, #1A66F9 0%, #1A66F9 32.29%, #605CFF 100%)',
    hoverColor:
      'linear-gradient(90deg, #1553CA 0%, #1553CA 32.29%, #4C4AC7 100%)',
  },

  large: {
    width: '512px',
    height: '48px',
    fontSize: '16px',
    background: '#1a66f9',
    hoverColor: '#1553ca',
  },
};
interface Props {
  size?: 'default' | 'large' | 'small';
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit' | 'button';
  href?: string;
  target?: string;
  onClick?: () => void;
}

function PrimaryButton({
  size = 'default',
  children,
  htmlType = 'button',
  icon,
  ...props
}: Props) {
  return (
    <Button
      css={buttonCss.self}
      style={{
        ['--font-size' as any]: sizeCss[size].fontSize,
        ['--size-width' as any]: sizeCss[size].width,
        ['--size-height' as any]: sizeCss[size].height,
        ['--background-color' as any]: sizeCss[size].background,
        ['--hover-color' as any]: sizeCss[size].hoverColor,
      }}
      htmlType={htmlType}
      {...props}
    >
      <TurtleText>{children}</TurtleText>
      {icon && <div css={buttonCss.icon}>{icon}</div>}
    </Button>
  );
}

const buttonCss = {
  self: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    fontWeight: 500,

    border: 'none',
    color: '#fff',

    '&:hover': {
      color: '#fff',
      background: 'var(--hover-color)',
    },

    // active 상태
    '&.ant-btn:focus': {
      color: '#fff',
      background: 'var(--background-color)',
    },

    //disabled
    '&.ant-btn[disabled]': {
      color: '#fff',
      background: '#C3C4C6',
    },

    background: 'var(--background-color)',
    fontSize: 'var(--font-size)',
    width: 'var(--size-width)',
    height: 'var(--size-height)',
  }),

  icon: css({
    display: 'inline',
    marginLeft: 7,
  }),
};

export default PrimaryButton;
