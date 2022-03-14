import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import WarehousingPreviewList from "./WarehousingPreviewList";
import { t } from "i18next";

const WarehousingCreatePage = function () {
  const title = `${t("turtlechain")} - ${t("warehousing create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("warehousing create")}
        breadcrumbList={[t("warehousing management"), t("warehousing create")]}
        info={t("description.excel type")}
      />
      <WarehousingPreviewList />
    </>
  );
};

export default WarehousingCreatePage;
