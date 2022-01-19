import { Form, Input } from "antd";

interface Props {
  name: string;
  label: string;
  readOnly?: boolean;
  disabled?: boolean;
}

function TurtleInput({ name, label, readOnly = false, disabled }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <Input readOnly={readOnly} disabled={disabled} />
    </Form.Item>
  );
}

export default TurtleInput;
