import { css } from '@emotion/react';
import { pricePattern } from '@utils/pattern';
import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';

interface Props extends InputNumberProps {
  value?: number;
  min?: number;
}

export function TurtleTableNumberInput({ value, min = 0, ...props }: Props) {
  return (
    <InputNumber
      css={input}
      value={value}
      formatter={(value) => `${value}`.replace(pricePattern, ',')}
      min={min}
      step={1000}
      size="small"
      {...props}
    />
  );
}

export function TurtleTableWarningNumberInput({ value, ...props }: Props) {
  return (
    <TurtleTableNumberInput
      value={value}
      status={value ? '' : 'error'}
      {...props}
    />
  );
}

const input = css`
  width: 60%;
  height: 24px;
  border: 1px solid #d6d7da;
  border-radius: 4px;
`;
