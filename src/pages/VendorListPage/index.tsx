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

  const [searchType, setSearchType] = useState("all");
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<RequestGetVendors>({
    page: 1,
    type: "all",
    search_query: "",
    rt_store_id: "",
  });

  // 쇼핑몰 선택
  const selectStore = (storeId: number | "") => {
    setSearchType("all");
    setSearchString("");
    setPage(1);
    setSearchQuery({
      page: 1,
      type: "all",
      search_query: "",
      rt_store_id: storeId,
    });
  };

  // 거래처 리스트 검색
  const searchVendors = () => {
    setPage(1);
    setSearchQuery({ ...searchQuery, page: 1, type: searchType, search_query: searchString });
  };

  // 페이지 선택
  const selectPage = useCallback(
    (page: number) => {
      setPage(page);
      setSearchQuery({ ...searchQuery, page });
    },
    [setPage, searchQuery],
  );

  // 거래처 검색 string 입력
  const onChangeSearchString = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchString(e.currentTarget.value);
  }, []);

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
        searchVendors={searchVendors}
        searchType={searchType}
        setSearchType={setSearchType}
        searchString={searchString}
        onChangeSearchString={onChangeSearchString}
        page={page}
        selectPage={selectPage}
      />
    </>
  );
}

export default VendorListPage;
