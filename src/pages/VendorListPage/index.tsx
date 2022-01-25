import { RequestGetVendors } from "apis/vendorAPI";
import PageHeader from "components/PageHeader";
import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import VendorList from "./VendorList";

function VendorListPage() {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("vendor.list")}`;

  const [searchState, setSearchState] = useState<{
    page: number;
    type: string;
    search_query: string;
  }>({
    page: 1,
    type: "all",
    search_query: "",
  });

  const [searchQuery, setSearchQuery] = useState<RequestGetVendors>({
    page: 1,
    type: "all",
    search_query: "",
    rt_store_id: "",
  });

  // 쇼핑몰 선택
  const selectStore = (storeId: number | "") => {
    setSearchState({
      page: 1,
      type: "all",
      search_query: "",
    });
    setSearchQuery({
      page: 1,
      type: "all",
      search_query: "",
      rt_store_id: storeId,
    });
  };

  // 검색 버튼 클릭
  const searchVendors = () => {
    setSearchState({
      ...searchState,
      page: 1,
    });
    setSearchQuery({
      ...searchQuery,
      page: 1,
      type: searchState.type,
      search_query: searchState.search_query,
    });
  };

  // 검색 조건 선택
  const selectSearchType = useCallback(
    (type: string) => {
      setSearchState({
        ...searchState,
        type: type,
      });
    },
    [searchState],
  );

  // 페이지 선택
  const selectPage = useCallback(
    (page: number) => {
      setSearchState({
        ...searchState,
        page,
      });
      setSearchQuery({ ...searchQuery, page });
    },
    [searchState, searchQuery],
  );

  // 거래처 검색 string 입력
  const onChangeSearchString = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setSearchState({
        ...searchState,
        search_query: e.currentTarget.value,
      });
    },
    [searchState],
  );

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="Vendor"
        title={t("vendor.list")}
        breadcrumbList={[t("vendor.management"), t("vendor.list")]}
      />
      <Filter //
        selectStore={selectStore}
      />
      <VendorList //
        searchQuery={searchQuery}
        searchState={searchState}
        searchVendors={searchVendors}
        selectSearchType={selectSearchType}
        onChangeSearchString={onChangeSearchString}
        selectPage={selectPage}
      />
    </>
  );
}

export default VendorListPage;
