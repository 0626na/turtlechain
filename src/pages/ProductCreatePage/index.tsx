import PageHeader from "components/PageHeader";
import { t } from "i18next";
import { Helmet } from "react-helmet";

function ProductCreatePage() {
  const title = `${t("turtlechain")} - ${t("product.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="product"
        title={t("product.create")}
        breadcrumbList={[t("common.home"), t("product.management"), t("product.create")]}
      />
    </>
  );
}

export default ProductCreatePage;
