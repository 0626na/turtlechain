import { Form, InputNumber } from "antd";

interface Props {
  name: string;
  label: string;
}

function TurtleInputNumber({ name, label }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <InputNumber style={{ width: "100%" }} min={1} />
    </Form.Item>
  );
}

export default TurtleInputNumber;
