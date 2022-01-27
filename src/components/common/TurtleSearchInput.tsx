import { Form } from "antd";
import Search from "antd/lib/input/Search";
import { off } from "process";
import styled from "styled-components";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  onClick?: () => void;
}

function TurtleSearchInput({ name, label, placeholder, onClick }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <StyledSearch
        placeholder={placeholder}
        onClick={onClick}
        style={{ width: "96%" }}
        size="large"
        readOnly={true}
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
