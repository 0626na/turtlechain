import { RequestGetVendors } from "apis/vendorAPI";
import PageHeader from "components/PageHeader";
import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Toolbar from "./Toolbar";
import ClearingSheetList from "./ClearingSheetList";
import { RequestGetClearingSheet } from "apis/clearingAPI";
import { t } from "i18next";

export interface searchStateProps {
  page: number;
  clearing_status: "all" | "request" | "pending" | "complete";
  clearing_date: undefined | "request_date" | "complete_date";
}

function ClearingListPage() {
  const title = `${t("turtlechain")} - ${t("clearing.list")}`;

  const [searchState, setSearchState] = useState<searchStateProps>({
    page: 1,
    clearing_status: "all",
    clearing_date: undefined,
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
      clearing_status: "all",
      clearing_date: undefined,
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
      <Toolbar
        selectStore={selectStore}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchState={searchState}
        setSearchState={setSearchState}
      />
      <ClearingSheetList searchQuery={searchQuery} searchState={searchState} />
    </>
  );
}

export default ClearingListPage;
