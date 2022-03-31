import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import AdjustmentList from "./AdjustmentList";

const AdjustmentListPage = function () {
  const title = `${t("turtlechain")} - ${t("adjustment list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("adjustment list")}
        breadcrumbList={[t("adjustment management"), t("adjustment list")]}
      />
      <AdjustmentList />
    </>
  );
};

export default AdjustmentListPage;
