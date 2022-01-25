import { Space } from "antd";
import Search from "antd/lib/input/Search";
import React from "react";
import { useTranslation } from "react-i18next";
import TurtleSelect from "./common/TurtleSelect";

interface Props {
  searchType: string;
  onSelectSearchType: (value: string) => void;
  searchString: string;
  onChangeSearchString: (e: React.FormEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

function SearchFilter({
  searchType,
  onSelectSearchType,
  searchString,
  onChangeSearchString,
  onSearch,
}: Props) {
  const { t } = useTranslation();

  // 엔터키 눌렀을 때 검색
  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
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
      name: t("vendor.phone"),
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
        value={searchType}
        onSelect={onSelectSearchType}
      />
      <Search //
        placeholder={t("placeholder.search")}
        style={{ width: "20rem" }}
        value={searchString}
        onChange={onChangeSearchString}
        onSearch={onSearch}
        onKeyPress={onEnterPress}
        size="large"
      />
    </Space>
  );
}

export default SearchFilter;
