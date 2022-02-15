import PageHeader from "components/PageHeader";
import { Helmet } from "react-helmet";
import Toolbar from "./Toolbar";
import CreateVendorForm from "./CreateVendorForm";
import { t } from "i18next";

function VendorCreatePage() {
  const title = `${t("turtlechain")} - ${t("vendor.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="vendor"
        title={t("vendor.create")}
        breadcrumbList={[t("common.home"), t("vendor.management"), t("vendor.create")]}
        info={t("description.search vendor")}
      />
      <Toolbar />
      <CreateVendorForm />
    </>
  );
}

export default VendorCreatePage;
