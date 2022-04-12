import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

function index() {
  const title = `${t("turtlechain")} - ${t("clearing.balance")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("clearing.balance list")}
        info="안내문구"
        breadcrumbList={[t("clearing.management"), t("clearing.balance")]}
      />
      <PageBody />
    </>
  );
}

export default index;
