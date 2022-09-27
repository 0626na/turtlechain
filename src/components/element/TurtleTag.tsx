import { css } from '@emotion/react';
import React, { useMemo } from 'react';
import TurtleText from './TurtleText';

interface Props {
  children: React.ReactNode;
  color: 'orange' | 'cyan' | 'green';
}

function TurtleTag({ children, color }: Props) {
  const colors = useMemo(
    () => ({
      orange: {
        color: '#DD7A32',
        backgroundColor: '#FBEFE6',
      },
      cyan: {
        color: '#00AAB5',
        backgroundColor: '#DDF3F5',
      },
      green: {
        color: '#389E0D',
        backgroundColor: '#EBF6DF',
      },
    }),
    [],
  );

  return (
    <div
      css={container}
      style={{
        ['--color' as any]: colors[color].color,
        ['--background-color' as any]: colors[color].backgroundColor,
      }}
    >
      <TurtleText>{children}</TurtleText>
    </div>
  );
}

const container = css`
  height: 20px;

  padding: 0px 7px;

  display: inline-flex;
  align-items: center;
  border-radius: 4px;

  font-weight: 400;
  font-size: 12px;

  background-color: var(--background-color);
  color: var(--color);
`;

export default TurtleTag;
