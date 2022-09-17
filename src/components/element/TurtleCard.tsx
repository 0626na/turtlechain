import { css } from '@emotion/react';

import React from 'react';
import TurtleTag from './TurtleTag';
import TurtleText from './TurtleText';

interface Props {
  value: {
    color: string;
    title: string;
    count: number;
    price: number;
  }[];
}

function TurtleCard({ value }: Props) {
  return (
    <div css={cardsContainer}>
      {value.map(({ color, title, count, price }) => (
        <div css={card} key={title}>
          <div css={tagContainer}>
            <TurtleTag color={color}>{title}</TurtleTag>
          </div>

          <div css={metaContainer}>
            <TurtleText css={metaLeft}>{count}</TurtleText>
            <TurtleText css={metaRight}>건</TurtleText>
          </div>

          <TurtleText css={$price}>{`${price.toLocaleString()}원`}</TurtleText>
        </div>
      ))}
    </div>
  );
}

const cardsContainer = css`
  display: flex;
  gap: 20px;
`;

const card = css`
  width: 240px;
  height: 160px;
  padding: 20px;

  box-shadow: 0px 2px 14px 2px rgba(0, 0, 0, 0.08);
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const tagContainer = css`
  width: 37px;
`;

const metaContainer = css`
  color: #242934;
`;

const metaLeft = css`
  margin-top: 20px;

  font-size: 36px;
  font-weight: 700;
`;
const metaRight = css`
  margin-left: 2px;

  font-size: 20px;
  font-weight: 500;
`;

const $price = css`
  margin-top: 12px;
  font-weight: 400;
  font-size: 16px;
  color: #a1a2a6;
`;

export default TurtleCard;
