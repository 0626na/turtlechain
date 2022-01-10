import { Select } from "antd";
import { SelectValue } from "antd/lib/select";
import { ResponseGetStores, Store } from "apis/retailerStoreAPI";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

interface Props {
  options?: Array<Store>;
  loading?: boolean;
}

function TurtleSelect({ options, loading }: Props) {
  const { t } = useTranslation();

  const handleChange = (value: SelectValue) => {
    console.log(`selected ${value}`);
  };

  return (
    <StyledSelect
      placeholder={t("description.select mall")}
      loading={loading}
      onChange={handleChange}
    >
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
