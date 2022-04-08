import { Helmet } from "react-helmet";
import { t } from "i18next";
import { PageHeader } from "layouts/main";
import PageBody from "./PageBody";

function ClearingListPage() {
  const title = `${t("turtlechain")} - ${t("clearing.list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("clearing.list")}
        breadcrumbList={[t("clearing.management"), t("clearing.list")]}
      />
      <PageBody />
    </>
  );
}

export default ClearingListPage;
