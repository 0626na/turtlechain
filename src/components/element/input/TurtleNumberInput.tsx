import { InputNumber, InputNumberProps } from 'antd';
import { pricePattern } from '@utils/pattern';
import { css } from '@emotion/react';

interface Props extends InputNumberProps {
  step?: number;
  value?: number;
}

function TurtleNumberInput({ step = 1000, value, ...props }: Props) {
  return (
    <InputNumber
      {...props}
      value={value}
      css={priceInput}
      step={step}
      formatter={(value) => `${value}`.replace(pricePattern, ',')}
      min={0}
    />
  );
}

const priceInput = css`
  .ant-input-number-input {
    height: 36px;
    padding: 11px 12px;
  }
  display: inline-block;
  height: 36px;
  width: 100%;

  color: #242934;

  border: 1px solid #cbccd1;
  border-radius: 8px;
  box-shadow: 0px 1px 2px rgba(27, 62, 114, 0.1);

  background-color: #fcfcfc;

  &:hover {
    border-color: #cbccd1;
  }

  .ant-input-number-handler-wrap {
    border-radius: 8px;
  }
`;

export default TurtleNumberInput;
