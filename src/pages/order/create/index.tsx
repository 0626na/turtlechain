import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import OrderPreviewList from "./OrderPreviewList";

const OrderCreatePage = function () {
  const title = `${t("turtlechain")} - ${t("order.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("order.create")}
        breadcrumbList={[t("order.management"), t("order.create")]}
        infoList={[t("description.excel type")]}
      />
      <OrderPreviewList />
    </>
  );
};

export default OrderCreatePage;
