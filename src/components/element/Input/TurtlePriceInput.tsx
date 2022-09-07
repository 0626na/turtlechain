import { InputNumber, InputNumberProps } from 'antd';
import { pricePattern } from '@utils/pattern';

function TurtleInputPrice({ ...props }: InputNumberProps) {
  return (
    <InputNumber
      {...props}
      step={1000}
      formatter={(value) => `${value}`.replace(pricePattern, ',')}
      min={0}
    />
  );
}

export default TurtleInputPrice;
