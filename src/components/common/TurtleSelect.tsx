import { Select } from "antd";
import { SelectValue } from "antd/lib/select";
import { Store } from "apis/retailerStoreAPI";
import styled from "styled-components";

interface Props {
  options?: Array<Store>;
  loading?: boolean;
  placeholder?: string;
}

function TurtleSelect({ options, loading, placeholder }: Props) {
  const handleChange = (value: SelectValue) => {
    console.log(`selected ${value}`);
  };

  return (
    <StyledSelect placeholder={placeholder} loading={loading} onChange={handleChange}>
      {options?.map(({ name, id }) => {
        return (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        );
      })}
    </StyledSelect>
  );
}

const StyledSelect = styled(Select)`
  .ant-select-selector {
    width: 20rem !important;
  }
`;

export default TurtleSelect;
