import { Form, InputNumber } from "antd";
import styled from "styled-components";

interface Props {
  name: string;
  label: string;
}
function TurtleInputNumber({ name, label }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <StyledInputNumber min={1} />
    </Form.Item>
  );
}

const StyledInputNumber = styled(InputNumber)`
  width: 100%;
`;

export default TurtleInputNumber;
