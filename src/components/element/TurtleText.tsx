import React from 'react';
import { css } from '@emotion/react';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function TurtleText({ children, ...props }: Props) {
  return (
    <span css={text} {...props}>
      {children}
    </span>
  );
}

const text = css`
  display: inline-block;
  line-height: 1;
`;

export default TurtleText;
