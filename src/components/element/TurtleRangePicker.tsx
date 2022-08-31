import { DatePicker } from 'antd';
import moment from 'moment';
import styled from '@emotion/styled';

interface Props {
  value?: [moment.Moment, moment.Moment];
  onChange?: (value: any) => void; // value : [moment.Moment, moment.Moment]
}

function TurtleRangePicker({ value, onChange }: Props) {
  return (
    <StyledRangePicker
      value={value}
      onChange={onChange}
      placement="bottomLeft"
    />
  );
}

const StyledRangePicker = styled(DatePicker.RangePicker)`
  background: #f5f6f7;
  border: none;
  border-radius: 6px;
`;

export default TurtleRangePicker;
