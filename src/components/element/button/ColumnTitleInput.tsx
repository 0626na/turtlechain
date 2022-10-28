import { css } from '@emotion/react';
import React from 'react';
import TurtleIcon from '../icon/TurtleIcon';

interface Props extends React.HtmlHTMLAttributes<HTMLInputElement> {
  value: string;
}

function ColumnTitleInput({ value, ...props }: Props) {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;

        border: 1px solid #d6d7da;
        height: 36px;
        border-radius: 14px;
      `}
    >
      <input
        {...props}
        css={css`
          margin-left: 10px;
          width: 100%;
          border: none;
        `}
        type="text"
        value={value}
      />
      <div
        css={css`
          margin-right: 10px;
        `}
      >
        <TurtleIcon name="delete" />
      </div>
    </div>
  );
}

export default ColumnTitleInput;
