import { Helmet } from "react-helmet";
import { t } from "i18next";
import { PageHeader } from "layouts/main";
import PageBody from "./PageBody";

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
      <PageBody />
    </>
  );
}

export default StoreManagementPage;
