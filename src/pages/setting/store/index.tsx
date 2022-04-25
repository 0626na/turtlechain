import { Helmet } from "react-helmet";
import { t } from "i18next";
import MyStoreTable from "./MyStoreTable";
import { PageHeader } from "layouts/main";

function StoreManagementPage() {
  const title = `${t("turtlechain")} - ${t("store.management")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("store.management")}
        breadcrumbList={[t("setting"), t("store.management")]}
        infoList={[
          t("description.first way to manage malls"),
          t("description.second way to manage malls"),
        ]}
      />
      <MyStoreTable />
    </>
  );
}

export default StoreManagementPage;
