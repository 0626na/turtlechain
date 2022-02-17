import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import OrderSheetList from "./OrderSheetList";
import Toolbar from "./Toolbar";
import { t } from "i18next";

const OrderListPage = function () {
  const title = `${t("turtlechain")} - ${t("order.list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order.list")}
        breadcrumbList={[t("common.home"), t("order.management"), t("order.list")]}
      />
      <Toolbar />
      <OrderSheetList />
    </>
  );
};

export default OrderListPage;
