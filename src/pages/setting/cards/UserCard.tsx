import { css } from '@emotion/react';
import React from 'react';

interface Props {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function UserCard({ title, icon, children }: Props) {
  return (
    <div css={card}>
      <div css={titleContainer}>
        {icon && (
          <div
            css={{
              marginRight: 12,
              display: 'flex',
            }}
          >
            {icon}
          </div>
        )}
        <div css={{ display: 'flex', alignItems: 'center' }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

const card = css`
  width: 592px;
  padding: 20px 40px 44px 40px;
  box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.12);
  border-radius: 14px;
  background-color: #fff;
`;

const titleContainer = css`
  margin-bottom: 32px;
  font-weight: 700;
  font-size: 20px;
  display: flex;
`;

export default UserCard;
