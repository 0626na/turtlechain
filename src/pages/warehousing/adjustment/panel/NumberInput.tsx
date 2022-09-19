import { css } from '@emotion/react';
import { pricePattern } from '@utils/pattern';
import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';

interface Props extends InputNumberProps {
  defaultValue: number;
}

function NumberInput({ defaultValue, ...props }: Props) {
  return (
    <InputNumber
      {...props}
      status={defaultValue === 0 ? 'error' : ''}
      defaultValue={defaultValue}
      formatter={(value) => `${value}`.replace(pricePattern, ',')}
      min={0}
      step={1000}
      size="small"
      css={input}
    />
  );
}

const input = css`
  height: 24px;
  text-align: right;
  border: 1px solid #d6d7da;
  border-radius: 4px;
`;

export default NumberInput;
