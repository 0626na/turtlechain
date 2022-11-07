import { css } from '@emotion/react';
import React from 'react';
import { ReactComponent as Plus } from '@icons/plus.svg';
interface Props {
  value?: string;
}
function PlusIcon({ value }: Props) {
  return (
    <div css={iconContainer}>
      <Plus css={{ stroke: value }} />
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

export default PlusIcon;
