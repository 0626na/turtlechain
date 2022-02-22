import { Form, InputNumber } from "antd";
import { DefaultValue } from "recoil";

interface Props {
  name: string;
  label: string;
  min: number | 1;
  defaultValue: number | 0;
}

function TurtleInputNumber({ name, label , min, defaultValue}: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <InputNumber style={{ width: "100%" }} min={min} value={defaultValue}/>
    </Form.Item>
  );
}

export default TurtleInputNumber;
