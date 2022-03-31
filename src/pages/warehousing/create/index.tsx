import { Helmet } from "react-helmet";
import { t } from "i18next";
import { PageHeader } from "layouts/main";
import WarehousingPreviewList from "./WarehousingPreviewList";

function WarehousingCreatePage() {
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
}

export default WarehousingCreatePage;
