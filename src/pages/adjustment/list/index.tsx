import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

const AdjustmentListPage = function () {
  const title = `${t("turtlechain")} - ${t("adjustment list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("adjustment list")}
        breadcrumbList={[t("adjustment management"), t("adjustment list")]}
      />
      <PageBody />
    </>
  );
};

export default AdjustmentListPage;
