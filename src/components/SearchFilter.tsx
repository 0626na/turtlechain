import { Space } from "antd";
import Search from "antd/lib/input/Search";
import React, { useState } from "react";
import styled from "styled-components";
import TurtleSelect from "./common/TurtleSelect";
import { t } from "i18next";

interface Props {
  type: "vendor" | "product";
  onSearch: (searchState: SearchState) => void;
}

interface SearchState {
  type: string;
  search_string: string;
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
  };

  // 엔터키 눌렀을 때 검색
  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch({ ...searchState });
  };

  const vendorOptions: Array<{ name: string; value: string }> = [
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

  const productOptions: Array<{ name: string; value: string }> = [
    {
      name: t("common.all"),
      value: "all",
    },
    {
      name: t("product.name"), //
      value: "name",
    },
    {
      name: t("product.vendor name"),
      value: "vendor_product_name",
    },
    {
      name: t("vendor.name"),
      value: "vendor_name",
    },
  ];

  return (
    <Space>
      <TurtleSelect //
        label={t("common.search")}
        width="short"
        placeholder={t("placeholder.all")}
        options={type === "vendor" ? vendorOptions : productOptions}
        value={searchState.type}
        onSelect={onSelectSearchType}
      />
      <StyledSearch //
        placeholder={t("placeholder.search")}
        style={{ width: "20rem" }}
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
