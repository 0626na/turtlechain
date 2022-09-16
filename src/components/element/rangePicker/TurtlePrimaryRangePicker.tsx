import { DatePicker } from 'antd';

import { css } from '@emotion/react';
import { RangePickerProps } from 'antd/lib/date-picker';

function TurtlePrimaryRangePicker({ ...props }: RangePickerProps) {
  return (
    <DatePicker.RangePicker
      {...props}
      css={container}
      allowClear={false}
      placement="bottomLeft"
    />
  );
}

const container = css`
  background: #f5f6f7;
  border: none;
  border-radius: 6px;
`;

export default TurtlePrimaryRangePicker;
