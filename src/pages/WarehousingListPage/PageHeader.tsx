// lang
import { useTranslation } from "react-i18next";
// antd
import { PageHeader as Header } from "antd";

const PageHeader = function () {
  const { t } = useTranslation();
  return <Header title={t("warehousing list")}></Header>;
};

export default PageHeader;
