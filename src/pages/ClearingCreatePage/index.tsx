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
      <Toolbar
        selectStore={selectStore}
        warningPhrase={"쇼핑몰 변경 시 작업하였던 정보가 모두 사라집니다. 바꾸시겠습니까?"}
      />
      <ClearingCreateAccordion selectedRtStoreId={selectedRtStoreId} />
    </>
  );
}

export default ClearingCreatePage;
