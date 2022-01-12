import { Form, Input } from "antd";

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
}

function TurtleInput({ name, label, disabled }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <Input readOnly disabled={disabled} />
    </Form.Item>
  );
}

export default TurtleInput;
