import { Form } from "antd";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  name: string;
  label: string;
  placeholder: string;
  rows?: number;
  required?: boolean;
}
function TurtleTextArea({ name, label, placeholder, rows = 14, required = false }: Props) {
  return (
    <Form.Item name={name} label={label}>
      <TextArea placeholder={placeholder} allowClear rows={rows} />
    </Form.Item>
  );
}

export default TurtleTextArea;
