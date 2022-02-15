import { Helmet } from "react-helmet";
import { useState } from "react";
import { t } from "i18next";
import PageHeader from "components/PageHeader";
import Toolbar from "./Toolbar";
import ClearingCreateAccordion from "./ClearingCreateAccordion";

/*
  Parent : None
  Children : Toolbar, ClearingCreateAccordion
*/

function ClearingCreatePage() {
  const title = `${t("turtlechain")} - ${t("clearing.create")}`;
  const [selectedRtStoreId, setSelectedRtStoreId] = useState<number | "">("");

  // 쇼핑몰 선택
  const selectStore = (storeId: number | "") => setSelectedRtStoreId(storeId);
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="clearing"
        title={t("clearing.create")}
        breadcrumbList={[t("clearing.management"), t("clearing.create")]}
      />
      <Toolbar selectStore={selectStore} warningMessage={t("message.warning change mall")} />
      <ClearingCreateAccordion selectedRtStoreId={selectedRtStoreId} />
    </>
  );
}

export default ClearingCreatePage;
