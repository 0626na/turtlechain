import { Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";

interface Props {
  name: string;
  label: string;
  placeholder: string;
}
function TurtleTextArea({ name, label, placeholder }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <TextArea placeholder={placeholder} allowClear rows={13} />
    </Form.Item>
  );
}

export default TurtleTextArea;
