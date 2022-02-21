import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import OrderSheetList from "./OrderSheetList";
import Toolbar from "./Toolbar";
import { t } from "i18next";
import { useState } from "react";
import { RequestGetList } from "apis/orderAPI";
import moment from "moment";

const OrderListPage = function () {
  const title = `${t("turtlechain")} - ${t("order.list")}`;

  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: -1,
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  });

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order.list")}
        breadcrumbList={[t("common.home"), t("order.management"), t("order.list")]}
      />
      <Toolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <OrderSheetList searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </>
  );
};

export default OrderListPage;
