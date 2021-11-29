import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageHeader from "./PageHeader";
import WarehousingTable from "./WarehousingTable";

const WarehousingListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing list")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader />
      <WarehousingTable />
    </>
  );
};

export default WarehousingListPage;
