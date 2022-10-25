import React from 'react';
import { css } from '@emotion/react';
import { pricePattern } from '@utils/pattern';
import { InputNumber, InputNumberProps } from 'antd';
interface Props extends InputNumberProps {
  value?: number;
  min?: number;
  step?: number;
}

export function TurtleTableNumberInput({
  defaultValue,
  min = 0,
  value,
  step = 1000,
  ...props
}: Props) {
  return (
    <InputNumber
      css={input}
      value={value}
      formatter={(value) => `${value}`.replace(pricePattern, ',')}
      min={min}
      step={step}
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
