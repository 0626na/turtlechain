import { Button } from 'antd';

import TurtleText from '../TurtleText';
import { css } from '@emotion/react';
interface Props {
  text: string;
  icon?: React.ReactNode;
  size?: 'default' | 'large';
  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
}

const sizeCss = {
  default: {
    width: '160px',
    height: '40px',
  },
  large: {
    width: '100%',
    height: '48px',
  },
};

function TertiaryButton({ text, icon, size = 'default', ...props }: Props) {
  return (
    <Button
      css={button}
      style={{
        ['--size-width' as string]: sizeCss[size].width,
        ['--size-height' as string]: sizeCss[size].height,
      }}
      {...props}
    >
      {icon && <div css={iconContainer}>{icon}</div>}
      <TurtleText>{text}</TurtleText>
    </Button>
  );
}

const button = css({
  width: 'var(--size-width)',
  height: 'var(--size-height)',

  fontWeight: 700,
  border: 'none',
  borderRadius: 8,

  display: 'inlineFlex',
  alignItems: 'center',
  justifyContent: 'center',

  color: '#00aab5',
  stroke: '#00aab5',
  backgroundColor: '#ddf3f5',

  '&:hover': {
    color: '#00aab5',
    stroke: '#00aab5',
    backgroundColor: '#d4e9eb',
  },

  // active 상태
  '&.ant-btn:focus': {
    color: '#00aab5',
    stroke: '#00aab5',
    backgroundColor: '#ddf3f5',
    borderColor: '#ddf3f5',
  },

  '&.ant-btn[disabled]': {
    color: '#00aab5',
    stroke: '#00aab5',
    backgroundColor: '#ddf3f5',
    opacity: 0.5,
  },
});

const iconContainer = css`
  margin-right: 5px;

  display: flex;
  align-items: center;
`;

export default TertiaryButton;
