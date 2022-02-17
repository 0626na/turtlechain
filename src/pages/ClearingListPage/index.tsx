import { RequestGetVendors } from "apis/vendorAPI";
import PageHeader from "components/PageHeader";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Toolbar from "./Toolbar";
import ClearingSheetList from "./ClearingSheetList";
import { RequestGetClearingSheet } from "apis/clearingAPI";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

export interface searchStateProps {
  page: number;
  clearing_status: "all" | "request" | "pending" | "complete";
  clearing_date: undefined | "request_date" | "complete_date";
}

function ClearingListPage() {
  const store = useRecoilValue(storeState);

  const title = `${t("turtlechain")} - ${t("clearing.list")}`;

  const [searchState, setSearchState] = useState<searchStateProps>({
    page: 1,
    clearing_status: "all",
    clearing_date: undefined,
  });

  const [searchQuery, setSearchQuery] = useState<RequestGetClearingSheet>({
    rt_store_id: undefined,
    start_date: "", // format: YYYY-MM-DD
    end_date: "", // format: YYYY-MM-DD
    page: 1,
    status: "",
  });

  useEffect(() => {
    setSearchState({
      page: 1,
      clearing_status: "all",
      clearing_date: undefined,
    });
    setSearchQuery({
      rt_store_id: store.id,
      start_date: "",
      end_date: "",
      page: 1,
      status: "",
    });
  }, [store.id])

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="clearing"
        title={t("clearing.list")}
        breadcrumbList={[t("clearing.management"), t("clearing.list")]}
      />
      <Toolbar
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
