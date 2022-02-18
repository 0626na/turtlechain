import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import OrderCreateForm from "./OrderCreateForm";
import OrderPreviewList from "./OrderPreviewList";
import Toolbar from "./Toolbar";
import { t } from "i18next";

const OrderCreatePage = function () {
  const title = `${t("turtlechain")} - ${t("order.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order.create")}
        breadcrumbList={[t("common.home"), t("order.management"), t("order.create")]}
      />
      <Toolbar />
      <OrderCreateForm />
      <OrderPreviewList />
    </>
  );
};

export default OrderCreatePage;
