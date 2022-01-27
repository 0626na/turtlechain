import PageHeader from "components/PageHeader";
import { Helmet } from "react-helmet";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Toolbar from "./Toolbar";
import ClearingCreateAccordion from "./ClearingCreateAccordion";
import { RequestCreateClearingSheet } from "apis/clearingAPI";

function ClearingCreatePage() {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("clearing.create")}`;
  const [searchState, setSearchState] = useState<{
    page: number;
    status: string;
  }>({
    page: 1,
    status: "",
  });

  // 쇼핑몰 선택
  const selectStore = (storeId: number | "") => {
    setSearchState({
      page: 1,
      status: "",
    });
  };

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="clearing"
        title={t("clearing.create")}
        breadcrumbList={[t("clearing.management"), t("clearing.create")]}
      />
      <Toolbar selectStore={selectStore} />
      <ClearingCreateAccordion />
    </>
  );
}

export default ClearingCreatePage;
