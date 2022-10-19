import React from 'react';
import { css } from '@emotion/react';
import { pricePattern } from '@utils/pattern';
import { InputNumber, InputNumberProps } from 'antd';
interface Props extends InputNumberProps {
  defaultValue?: number;
  min?: number;
}

function TurtleTableNumberInput({ defaultValue, min = 0, ...props }: Props) {
  return (
    <InputNumber
      {...props}
      status={defaultValue === 0 ? 'error' : ''}
      defaultValue={defaultValue}
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
