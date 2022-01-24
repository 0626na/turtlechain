import PageHeader from "components/PageHeader";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import ClearingCreateForm from "./ClearingCreateForm";

function ClearingCreatePage() {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("vendor.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="vendor"
        title={t("vendor.create")}
        breadcrumbList={[t("vendor.management"), t("vendor.create")]}
        info={t("description.search vendor")}
      />
      <Filter />
      <ClearingCreateForm />
    </>
  );
}

export default ClearingCreatePage;
