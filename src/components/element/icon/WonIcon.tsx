import { css } from '@emotion/react';
import React from 'react';
import { ReactComponent as Won } from '@icons/won.svg';

interface Props {
  // 사용처에서 이벤트전파 제어를 하기위해 인자 타입을 지정해준다.
  onClick?: (e: any) => void;
  value: string;
}

function WonIcon({ onClick, value }: Props) {
  return (
    <div css={iconContainer} onClick={onClick}>
      <Won css={{ stroke: value ? '#2ab8c1' : '#a1a2a6' }} />
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

export default WonIcon;
