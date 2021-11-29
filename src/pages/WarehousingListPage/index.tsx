import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const WarehousingListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing list")}`;
  return (
    <>
      <Helmet title={title} />
      입고 관리
    </>
  );
};

export default WarehousingListPage;
