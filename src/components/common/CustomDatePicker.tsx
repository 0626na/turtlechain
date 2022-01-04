import { DatePicker, Form, Space, Typography } from "antd";
import styled from "styled-components";

interface Props {
  label: string;
}

function CustomDatePicker({ label }: Props) {
  return (
    <Space size="large">
      <Typography.Text>{label}</Typography.Text>
      <DatePicker.RangePicker allowClear={false} />
    </Space>
  );
}

export default CustomDatePicker;
