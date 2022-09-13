import { DatePicker } from 'antd';
import moment from 'moment';

import { css } from '@emotion/react';

interface Props {
  value?: [moment.Moment, moment.Moment];
  onChange?: (value: any) => void; // value : [moment.Moment, moment.Moment]
}

function TurtlePrimaryRangePicker({ value, onChange }: Props) {
  return (
    <DatePicker.RangePicker
      css={container}
      value={value}
      onChange={onChange}
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
