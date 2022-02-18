import { Helmet } from "react-helmet";
import MyStorePageHeader from "./MyStorePageHeader";
import MyStoreTable from "./MyStoreTable";
import { t } from "i18next";

const MyStorePage = function () {
  const title = `${t("turtlechain")} - ${t("store.info")}`;
  return (
    <>
      <Helmet title={title} />
      <MyStorePageHeader />
      <MyStoreTable />
    </>
  );
};

export default MyStorePage;
