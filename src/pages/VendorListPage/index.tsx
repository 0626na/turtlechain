import { RequestGetVendors } from "apis/vendorAPI";
import PageHeader from "components/PageHeader";
import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Toolbar from "./Toolbar";
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
    rt_store_id: -1,
  });

  // 쇼핑몰 선택
  const selectStore = (storeId: number) => {
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

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="vendor"
        title={t("vendor.list")}
        breadcrumbList={[t("common.home"), t("vendor.management"), t("vendor.list")]}
      />
      <Toolbar //
        selectStore={selectStore}
      />
      <VendorList //
        searchQuery={searchQuery}
        searchState={searchState}
        searchVendors={searchVendors}
        selectPage={selectPage}
      />
    </>
  );
}

export default VendorListPage;
