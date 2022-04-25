import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

function BizManagementPage() {
  const title = `${t("turtlechain")} ${t("biz.management")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("biz.management")}
        breadcrumbList={[t("setting"), t("biz.management")]}
      />
      <PageBody />
    </>
  );
}

export default BizManagementPage;
