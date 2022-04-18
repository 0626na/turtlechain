import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

function ProductListPage() {
  const title = `${t("turtlechain")} - ${t("product.list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("product.list")}
        breadcrumbList={[t("product.management"), t("product.list")]}
      />
      <PageBody />
    </>
  );
}

export default ProductListPage;
