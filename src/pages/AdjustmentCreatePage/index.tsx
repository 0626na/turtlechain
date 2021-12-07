import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const AdjustmentCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment create")}`;
  return (
    <>
      <Helmet title={title} />
    </>
  );
};

export default AdjustmentCreatePage;
