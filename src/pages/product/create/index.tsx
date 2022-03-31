import { t } from "i18next";
import { PageHeader } from "layouts/page";
import { Helmet } from "react-helmet";
import ProductPreviewList from "./ProductPreviewList";

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
      <ProductPreviewList />
    </>
  );
}

export default ProductCreatePage;
