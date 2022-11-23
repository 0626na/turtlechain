import { css } from '@emotion/react';
import React from 'react';
import PlusIcon from '../icon/PlusIcon';

interface Props extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  text: string;
  required: boolean;
}

function AddColumnButton({ text, onClick, required, ...props }: Props) {
  return (
    <button
      css={css`
        cursor: pointer;
        flex-basis: 160px;
        flex-grow: 1;
        height: 40px;
        background-color: #f7f8f9;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `}
      onClick={onClick}
    >
      <div
        css={css`
          margin-left: 10px;
          font-size: 15px;
          font-weight: 400;
          display: flex;
          flex-shrink: 1;
        `}
      >
        {text}

        {(text === '거래처명' || text === '거래처 주소' || text === '수량') && (
          <span
            css={css`
              color: red;
            `}
          >
            *
          </span>
        )}
      </div>
      <div
        css={css`
          padding: 4px;
          background-color: #ddf3f5;
          margin-right: 10px;
          border-radius: 4px;
        `}
      >
        <PlusIcon value="#00AAB5" />
      </div>
    </button>
  );
}

export default AddColumnButton;
