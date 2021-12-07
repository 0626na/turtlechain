import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const AdjustmentListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment list")}`;
  return (
    <>
      <Helmet title={title} />
    </>
  );
};

export default AdjustmentListPage;
