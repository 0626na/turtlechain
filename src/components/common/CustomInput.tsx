import { Form, Input } from "antd";

interface Props {
  name: string;
  label: string;
}

function CustomInput({ name, label }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <Input readOnly />
    </Form.Item>
  );
}

export default CustomInput;
