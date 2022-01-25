import { Form, InputNumber } from "antd";

interface Props {
  name: string;
  label: string;
}

function TurtleInputNumber({ name, label }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <InputNumber style={{ width: "96%" }} min={1} size="large" />
    </Form.Item>
  );
}

export default TurtleInputNumber;
