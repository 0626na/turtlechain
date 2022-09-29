import { css } from '@emotion/react';
import React from 'react';
import { ReactComponent as Grid } from '@icons/grid.svg';

interface Props {
  // 사용처에서 이벤트전파 제어를 하기위해 인자 타입을 지정해준다.
  onClick?: (e: any) => void;
  value?: string;
}

function GridIcon({ onClick, value = 'rgba(255, 255, 255, 0.6)' }: Props) {
  return (
    <div css={iconContainer} onClick={onClick}>
      <Grid css={{ fill: value }} />
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

export default GridIcon;
