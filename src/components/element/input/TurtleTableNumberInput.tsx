import { css } from '@emotion/react';
import { pricePattern } from '@utils/pattern';
import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';

interface Props extends InputNumberProps {
  value?: number;
  min?: number;
}

function TurtleTableNumberInput({ value, min = 0, ...props }: Props) {
  console.log(value);
  return (
    <InputNumber
      {...props}
      status={value ? '' : 'error'}
      value={value}
      formatter={(value) => `${value}`.replace(pricePattern, ',')}
      min={min}
      step={1000}
      size="small"
      css={input}
    />
  );
}

const input = css`
  height: 24px;
  border: 1px solid #d6d7da;
  border-radius: 4px;
`;

export default TurtleTableNumberInput;
