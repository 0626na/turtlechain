import { Helmet } from "react-helmet";
import { t } from "i18next";
import MyStorePageHeader from "./MyStorePageHeader";
import MyStoreTable from "./MyStoreTable";

function MyStorePage() {
  const title = `${t("turtlechain")} - ${t("store.info")}`;
  return (
    <>
      <Helmet title={title} />
      <MyStorePageHeader />
      <MyStoreTable />
    </>
  );
}

export default MyStorePage;
