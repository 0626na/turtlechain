import { css } from '@emotion/react';
import React from 'react';
import { ReactComponent as AlertClose } from '@icons/alertClose.svg';
import { theme } from '@styles/theme';

interface Props {
  value?: string;
}

function AlertCloseIcon({ value = theme.grey400 }: Props) {
  return (
    <div css={iconContainer}>
      <AlertClose css={{ stroke: value }} />
    </div>
  );
}

const iconContainer = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default AlertCloseIcon;
