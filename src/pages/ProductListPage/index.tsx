import PageHeader from "components/PageHeader";
import { t } from "i18next";
import { Helmet } from "react-helmet";
import ProductList from "./ProductList";
import Toolbar from "./Toolbar";

function ProductListPage() {
  const title = `${t("turtlechain")} - ${t("product.list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="product"
        title={t("product.list")}
        breadcrumbList={[t("common.home"), t("product.management"), t("product.list")]}
      />
      <Toolbar />
      <ProductList />
    </>
  );
}

export default ProductListPage;
