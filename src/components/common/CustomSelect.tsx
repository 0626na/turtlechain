import { Select } from "antd";
import styled from "styled-components";

function CustomSelect() {
  const { Option } = Select;

  return (
    <StyledSelect placeholder="필요한 쇼핑몰을 선택하세요">
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
      <Option value="Yiminghe">yiminghe</Option>
    </StyledSelect>
  );
}

const StyledSelect = styled(Select)`
  .ant-select-selector {
    width: 20rem !important;
    border-radius: 0.4rem !important;
  }
`;

export default CustomSelect;
