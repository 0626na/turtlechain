import { css } from '@emotion/react';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

function TurtleStack({ children }: Props) {
  return (
    <div
      css={css`
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        flex-basis: 160px;
        flex-grow: 1;
        gap: 10px;
      `}
    >
      {children}
    </div>
  );
}

export default TurtleStack;
