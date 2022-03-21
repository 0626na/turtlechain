import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import AdjustmentList from "./AdjustmentList";
import { t } from "i18next";

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
