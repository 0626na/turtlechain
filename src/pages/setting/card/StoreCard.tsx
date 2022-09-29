import { css } from '@emotion/react';
import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

function StoreCard({ title, isOpen = false, children }: Props) {
  return (
    <div css={card}>
      <div css={titleContainer}>
        <div css={$title}>{title}</div>
        <div css={markContainer}>
          {isOpen ? (
            <>
              <div css={openMark}></div>
              <span css={marginLeft}>오픈</span>
            </>
          ) : (
            <>
              <div css={closeMark}></div>
              <span css={marginLeft}>폐점</span>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

const card = css`
  flex-basis: 518px;
  height: 302px;
  padding: 28px 24px 40px;
  box-shadow: 0px 2px 14px 2px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background-color: #fff;
`;

const titleContainer = css`
  margin-bottom: 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const $title = css`
  font-weight: 500;
  font-size: 20px;
  color: #242934;
`;

const markContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  color: #5b5d63;
`;

const openMark = css`
  width: 8px;
  height: 8px;
  background-color: #00b3be;
  border-radius: 50%;
`;

const closeMark = css`
  width: 8px;
  height: 8px;
  background-color: #a1a2a6;
  border-radius: 50%;
`;

const marginLeft = css`
  margin-left: 7px;
`;

export default StoreCard;
