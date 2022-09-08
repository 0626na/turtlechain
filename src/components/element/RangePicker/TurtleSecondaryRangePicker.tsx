import { DatePicker } from 'antd';
import { css } from '@emotion/react';
import { RangePickerProps } from 'antd/lib/date-picker';

// interface Props extends RangePickerProps {
//   value: [moment.Moment, moment.Moment];
//   onChange?: (_: unknown, dateStrings: string[]) => void; // value : [moment.Moment, moment.Moment]
// }

function TurtleSecondaryRangePicker({ ...props }: RangePickerProps) {
  return (
    <DatePicker.RangePicker
      {...props}
      css={container}
      allowClear={false}
      placement="bottomLeft"
      // value={value}
      // onChange={onChange}
    />
  );
}

const container = css`
  width: 352px;
  height: 40px;

  background: #fcfcfc;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);

  border: 1px solid #cbccd1;
  border-radius: 6px;

  .ant-picker-suffix {
    color: #00b3be;
  }
`;

export default TurtleSecondaryRangePicker;
