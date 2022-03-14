import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import AdjustmentPreviewList from "./AdjustmentPreviewList";
import { t } from "i18next";

const AdjustmentCreatePage = function () {
  const title = `${t("turtlechain")} - ${t("adjustment create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("adjustment create")}
        breadcrumbList={[t("adjustment management"), t("adjustment create")]}
      />
      <AdjustmentPreviewList />
    </>
  );
};

export default AdjustmentCreatePage;
