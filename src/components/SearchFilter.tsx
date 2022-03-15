import { Select, Space } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import TurtleSelect from "./common/TurtleSelect";
import { t } from "i18next";

export interface SearchState {
  type: string;
  search_string: string;
}

interface Props {
  type: "vendor" | "product";
  onSearch: (searchState: SearchState) => void;
}

function SearchFilter({ type, onSearch }: Props) {
  const [searchState, setSearchState] = useState<SearchState>({
    type: "all",
    search_string: "",
  });

  const onSelectSearchType = (value: string) => {
    setSearchState({ ...searchState, type: value });
  };

  const onChangeSearchString = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchState({ ...searchState, search_string: e.currentTarget.value });
    onSearch({ ...searchState, search_string: e.currentTarget.value });
  };

  // 엔터키 눌렀을 때 검색
  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch({ ...searchState });
  };

  // Select Box 옵션 선택
  const options = useMemo(() => {
    if (type === "vendor")
      return [
        {
          name: t("common.all"),
          value: "all",
        },
        {
          name: t("product.name"), //
          value: "name",
        },
        {
          name: t("product.vendor product name"),
          value: "vendor_product_name",
        },
        {
          name: t("vendor.name"),
          value: "vendor_name",
        },
      ];
    if (type === "product")
      return [
        {
          name: t("common.all"),
          value: "all",
        },
        {
          name: t("vendor.name"),
          value: "name",
        },
        {
          name: t("vendor.account"),
          value: "account",
        },
        {
          name: t("vendor.store phone"),
          value: "phone",
        },
      ];
  }, [type]);

  return (
    <Space>
      <Select
        style={{ width: 100 }}
        size="small"
        value={searchState.type}
        onSelect={onSelectSearchType}
      >
        {options?.map(({ name, value }) => (
          <Select.Option key={value} value={value}>
            {name}
          </Select.Option>
        ))}
      </Select>
      <StyledSearch //
        size="small"
        placeholder={t("placeholder.search")}
        style={{ width: 200 }}
        value={searchState.search_string}
        onChange={onChangeSearchString}
        onKeyPress={onEnterPress}
        onSearch={() => {
          onSearch(searchState);
        }}
      />
    </Space>
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

export default SearchFilter;
