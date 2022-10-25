import { css } from '@emotion/react';
import React, { MouseEvent } from 'react';
import { ReactComponent as Memo } from '@icons/memo.svg';

interface Props {
  // 사용처에서 이벤트전파 제어를 하기위해 인자 타입을 지정해준다.
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  value?: string;
}

function MemoIcon({ onClick, value }: Props) {
  return (
    <div css={iconContainer} onClick={onClick}>
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
