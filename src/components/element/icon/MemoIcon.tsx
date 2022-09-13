import { css } from '@emotion/react';
import React from 'react';
import { ReactComponent as Memo } from '@icons/memo.svg';

interface Props {
  onClick?: () => void;
  value: string;
}

function MemoIcon({ onClick, value }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onClick && onClick();
  };

  return (
    <div css={iconContainer} onClick={handleClick}>
      <Memo css={{ stroke: value ? '#2ab8c1' : '#a1a2a6' }} />
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

export default MemoIcon;
