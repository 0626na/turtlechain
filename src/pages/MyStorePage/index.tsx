import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import MyStorePageHeader from "./MyStorePageHeader";
import MyStoreTable from "./MyStoreTable";

const MyStorePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("mall info")}`;
  return (
    <>
      <Helmet title={title} />
      <MyStorePageHeader />
      <MyStoreTable />
    </>
  );
};

export default MyStorePage;
