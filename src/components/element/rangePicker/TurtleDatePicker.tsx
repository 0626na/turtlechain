import React, { useEffect } from 'react';
import { css } from '@emotion/react';
import { theme } from '@styles/theme';
import { DatePicker, DatePickerProps } from 'antd';
import moment from 'moment';
import useOrderCart from '@hooks/useOrderCart';

interface Props {
  date: moment.Moment;
  onchange: (value: moment.Moment) => void;
}

function TurtleDatePicker({ date, onchange }: Props) {
  return (
    <div>
      <DatePicker
        css={datePicker}
        value={date}
        onChange={(value) => onchange(moment(value))}
        allowClear={false}
      />
    </div>
  );
}

const datePicker = css({
  marginLeft: 12,
  backgroundColor: '#DDF3F5',
  borderRadius: 8,
  border: 'none',
  color: '#00B3BE',
  '.ant-picker-suffix,input': {
    color: '#00b3be',
  },
});

export default TurtleDatePicker;
