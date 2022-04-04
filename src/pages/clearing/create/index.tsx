import { Helmet } from "react-helmet";
import { t } from "i18next";
import ClearingCreateAccordion from "./ClearingCreateAccordion";
import { PageHeader, MenuBar } from "layouts/main";

/*
  Parent : None
  Children : MenuBar, ClearingCreateAccordion
*/

function ClearingCreatePage() {
  const title = `${t("turtlechain")} - ${t("clearing.create")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("clearing.create")}
        breadcrumbList={[t("clearing.management"), t("clearing.create")]}
      />
      <MenuBar isWarning />
      <ClearingCreateAccordion />
    </>
  );
}

export default ClearingCreatePage;
