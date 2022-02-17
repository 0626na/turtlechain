import { Form } from "antd";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  name: string;
  label: string;
  placeholder: string;
  rows?: number;
  required?: boolean;
}
function TurtleTextArea({ name, label, placeholder, rows = 14, required = true }: Props) {
  return (
    <Form.Item name={name} label={label} required={required}>
      <TextArea placeholder={placeholder} allowClear rows={rows} />
    </Form.Item>
  );
}

export default TurtleTextArea;
