import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

function MistransferCreatePage() {
  const title = `${t("turtlechain")} - ${t("mistransfer.create")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("mistransfer.create")}
        breadcrumbList={[t("mistransfer.management"), t("mistransfer.create")]}
      />
      <PageBody />
    </>
  );
}

export default MistransferCreatePage;
