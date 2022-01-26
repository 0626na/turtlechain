import { Form } from "antd";
import Search from "antd/lib/input/Search";
import styled from "styled-components";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
}

function TurtleSearchInput({ name, label, placeholder }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <StyledSearch
        placeholder={placeholder}
        onSearch={() => {}}
        style={{ width: "96%" }}
        size="large"
      />
    </Form.Item>
  );
}

const StyledSearch = styled(Search)`
  .ant-input-search-button {
    border-left: none;
    height: 40.14px;
  }
  svg {
    color: #5b5d63;
  }
`;

export default TurtleSearchInput;
