import { Helmet } from "react-helmet";
import WarehousingSheetList from "./WarehousingSheetList";
import { t } from "i18next";
import { PageHeader } from "layouts/page";

function WarehousingListPage() {
  const title = `${t("turtlechain")} - ${t("warehousing list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("warehousing list")}
        breadcrumbList={[t("warehousing management"), t("warehousing list")]}
      />

      <WarehousingSheetList />
    </>
  );
}

export default WarehousingListPage;
