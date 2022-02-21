import { DatePicker, Typography } from "antd";
import { Moment } from "moment";

interface Props {
  label?: string;
}

function TurtleDatePicker({ label }: Props) {
  return (
    <>
      <Typography.Text>{label}</Typography.Text>
      <DatePicker.RangePicker allowClear={false} />
    </>
  );
}

export default TurtleDatePicker;
