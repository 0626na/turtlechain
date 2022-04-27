import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

function CompanyManagementPage() {
  const title = `${t("turtlechain")} - ${t("company.management")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("company.management")}
        breadcrumbList={[t("setting"), t("company.management")]}
      />
      <PageBody />
    </>
  );
}

export default CompanyManagementPage;
