import { css } from '@emotion/react';
import React from 'react';
import { ReactComponent as ArrowRight } from '@icons/arrowRight.svg';

interface Props {
  value?: string;
}

function ArrowRightIcon({ value = '#a1a2a6' }: Props) {
  return (
    <div css={iconContainer}>
      <ArrowRight css={{ fill: value }} />
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

export default ArrowRightIcon;
