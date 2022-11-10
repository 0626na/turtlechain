import { css } from '@emotion/react';
import { theme } from '@styles/theme';
import React from 'react';

import TurtleText from './TurtleText';

interface Props {
  size?: 'small' | 'large';
  children: React.ReactNode;
  color:
    | 'orange'
    | 'cyan'
    | 'green'
    | 'gray'
    | 'skyblue'
    | 'red'
    | 'orderHistoryCategoryFirst'
    | 'orderHistoryCategorySecond';
}

const colors = {
  orange: {
    color: theme.orangeTx,
    backgroundColor: theme.orangeBg,
  },
  cyan: {
    color: theme.skyblueTx,
    backgroundColor: theme.skyblueBg,
  },
  green: {
    color: '#389E0D',
    backgroundColor: '#EBF6DF',
  },
  gray: {
    color: theme.greyTx,
    backgroundColor: theme.greyBg,
  },
  skyblue: {
    color: '#2CA4D4',
    backgroundColor: '#E6F4FA',
  },
  red: {
    color: '#DD3247',
    backgroundColor: '#FBE6E9',
  },
  orderHistoryCategoryFirst: {
    color: '#29A9DD',
    backgroundColor: '#E6F4FA',
  },
  orderHistoryCategorySecond: {
    color: '#FFFFFF',
    backgroundColor: '#29A9DD',
  },
};

function TurtleTag({ children, color, size = 'small' }: Props) {
  if (size === 'large') {
    return (
      <div
        css={largeContainer}
        style={{
          ['--color' as string]: colors[color].color,
          ['--background-color' as string]: colors[color].backgroundColor,
        }}
      >
        <TurtleText>{children}</TurtleText>
      </div>
    );
  }

  return (
    <div
      css={smallContainer}
      style={{
        ['--color' as string]: colors[color].color,
        ['--background-color' as string]: colors[color].backgroundColor,
      }}
    >
      <TurtleText>{children}</TurtleText>
    </div>
  );
}

const largeContainer = css`
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;

  background-color: var(--background-color);
  color: var(--color);
`;

const smallContainer = css`
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
