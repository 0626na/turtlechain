import { Helmet } from "react-helmet";
import { t } from "i18next";
import { PageHeader, Toolbar } from "layouts/page";
import ClearingCreateAccordion from "./ClearingCreateAccordion";

/*
  Parent : None
  Children : Toolbar, ClearingCreateAccordion
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
      <Toolbar isWarning />
      <ClearingCreateAccordion />
    </>
  );
}

export default ClearingCreatePage;
