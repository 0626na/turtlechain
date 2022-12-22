import { css } from '@emotion/react';
import { t } from 'i18next';

import React from 'react';
import TurtleTag from './TurtleTag';
import TurtleText from './TurtleText';

interface Props {
  value: {
    color: 'orange' | 'cyan' | 'green';
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
          <TurtleTag color={color}>{title}</TurtleTag>

          <div css={metaContainer}>
            <TurtleText css={metaLeft}>{count}</TurtleText>
            <TurtleText css={metaRight}>
              {t('description.number', { number: '' })}
            </TurtleText>
          </div>

          <TurtleText css={$price}>{`${price.toLocaleString()}${t(
            'description.won',
          )}`}</TurtleText>
        </div>
      ))}
    </div>
  );
}

const cardsContainer = css`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
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
