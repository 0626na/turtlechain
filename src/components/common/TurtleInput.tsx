import { Form, Input } from "antd";

interface Props {
  required?: boolean;
  name?: Array<string> | string;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  value?: string;
}

function TurtleInput({
  required = true,
  name,
  label,
  placeholder,
  readOnly = false,
  disabled,
  value,
}: Props) {
  return (
    <Form.Item required={required} name={name} label={label} rules={[{ required: required }]}>
      <Input
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        style={{ width: "96%" }}
        value={value}
      />
    </Form.Item>
  );
}

export default TurtleInput;
