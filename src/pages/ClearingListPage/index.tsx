import { RequestGetVendors } from "apis/vendorAPI";
import PageHeader from "components/PageHeader";
import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import ClearingList from "./ClearingList";
import { RequestGetClearingSheet } from "apis/clearingAPI";


function ClearingListPage() {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("clearing.list")}`;

  const [searchType, setSearchType] = useState("all");
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(1);
  const [searchState, setSearchState] = useState<{
    page: number;
    status: string;
  }>({
    page: 1,
    status: "",
  });

  const [searchQuery, setSearchQuery] = useState<RequestGetClearingSheet>({
    rt_store_id: "",
    start_date: "", // format: YYYY-MM-DD
    end_date: "", // format: YYYY-MM-DD
    page: 1,
    status: "",
  });

  // 쇼핑몰 선택
  const selectStore = (storeId: number | "") => {
    setSearchState({
      page: 1,
      status: "",
    });
    setSearchQuery({
      rt_store_id: storeId,
      start_date: "",
      end_date: "",
      page: 1,
      status: "",
    });
  };

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="Clearing"
        title={t("clearing.list")}
        breadcrumbList={[t("clearing.management"), t("clearing.list")]}
      />
      <Filter //
        selectStore={selectStore}
      />
      <ClearingList searchQuery={searchQuery} searchState={searchState}/>
    </>
  );
}

export default ClearingListPage;
