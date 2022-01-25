import PageHeader from "components/PageHeader";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import ClearingCreateForm from "./ClearingCreateForm";

function ClearingCreatePage() {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("clearing.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="clearing"
        title={t("clearing.create")}
        breadcrumbList={[t("clearing.management"), t("clearing.create")]}
      />
      <Filter />
      <ClearingCreateForm />
    </>
  );
}

export default ClearingCreatePage;
