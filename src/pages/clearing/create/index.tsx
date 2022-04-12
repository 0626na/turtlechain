import { Helmet } from "react-helmet";
import { t } from "i18next";
import { PageHeader } from "layouts/main";
import PageBody from "./PageBody";

function ClearingCreatePage() {
  const title = `${t("turtlechain")} - ${t("clearing.create")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("clearing.create")}
        breadcrumbList={[t("clearing.management"), t("clearing.create")]}
      />
      <PageBody />
    </>
  );
}

export default ClearingCreatePage;
