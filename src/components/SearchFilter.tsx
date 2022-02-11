import { Space } from "antd";
import Search from "antd/lib/input/Search";
import { RequestSearchVendor } from "apis/vendorAPI";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TurtleSelect from "./common/TurtleSelect";

interface Props {
  onSearch: (searchState: SearchState) => void;
}

interface SearchState {
  type: string;
  search_query: string;
}

function SearchFilter({ onSearch }: Props) {
  const { t } = useTranslation();

  const [searchState, setSearchState] = useState<SearchState>({
    type: "all",
    search_query: "",
  });

  const onSelectSearchType = (value: string) => {
    setSearchState({ ...searchState, type: value });
  };

  const onChangeSearchString = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchState({ ...searchState, search_query: e.currentTarget.value });
  };

  // 엔터키 눌렀을 때 검색
  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch({ ...searchState });
  };

  const options: Array<{ name: string; value: string }> = [
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

  return (
    <Space>
      <TurtleSelect //
        label={t("common.search")}
        width="short"
        placeholder={t("placeholder.all")}
        options={options}
        value={searchState.type}
        onSelect={onSelectSearchType}
      />
      <StyledSearch //
        placeholder={t("placeholder.search")}
        style={{ width: "20rem" }}
        value={searchState.search_query}
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
