import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

function ProductCreatePage() {
  const title = `${t("turtlechain")} - ${t("product.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("product.create")}
        breadcrumbList={[t("product.management"), t("product.create")]}
        info={t("description.excel type")}
      />
      <PageBody />
    </>
  );
}

export default ProductCreatePage;
