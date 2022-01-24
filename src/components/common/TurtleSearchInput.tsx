import { Form, Input } from "antd";
import Search from "antd/lib/input/Search";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
}

function TurtleSearchInput({ name, label, placeholder }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <Search placeholder={placeholder} onSearch={() => {}} style={{ width: "96%" }} />
    </Form.Item>
  );
}

export default TurtleSearchInput;
