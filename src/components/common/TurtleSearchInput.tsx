import { Form } from "antd";
import Search from "antd/lib/input/Search";
import { off } from "process";
import styled from "styled-components";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  onSearch?: () => void;
}

function TurtleSearchInput({ name, label, placeholder, onSearch }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <StyledSearch
        placeholder={placeholder}
        onClick={onSearch}
        onSearch={onSearch}
        style={{ width: "96%" }}
        readOnly={true}
      />
    </Form.Item>
  );
}

const StyledSearch = styled(Search)`
  .ant-input-search-button {
    border: 1px solid #d9d9d9;
    border-left: none;
  }
  svg {
    color: #5b5d63;
  }
`;

export default TurtleSearchInput;
