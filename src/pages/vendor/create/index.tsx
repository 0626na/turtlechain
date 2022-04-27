import { t } from "i18next";
import { Helmet } from "react-helmet";
import { PageHeader } from "layouts/main";
import PageBody from "./PageBody";

function VendorCreatePage() {
  const title = `${t("turtlechain")} - ${t("vendor.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("vendor.create")}
        breadcrumbList={[t("vendor.management"), t("vendor.create")]}
        infoList={[t("description.search vendor")]}
      />
      <PageBody />
    </>
  );
}

export default VendorCreatePage;
