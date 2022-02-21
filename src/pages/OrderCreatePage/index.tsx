import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import OrderCreateForm from "./OrderCreateForm";
import OrderPreviewList from "./OrderPreviewList";
import Toolbar from "./Toolbar";
import { t } from "i18next";
import { useCallback, useState } from "react";
import { CreateOrderItem } from "apis/orderAPI";

const OrderCreatePage = function () {
  const title = `${t("turtlechain")} - ${t("order.create")}`;

  const [itemList, setItemList] = useState<Array<CreateOrderItem>>([]);

  const addItem = useCallback(
    (item: CreateOrderItem) => {
      setItemList([...itemList, item]);
    },
    [itemList],
  );

  const deleteItem = useCallback(
    (id) => {
      setItemList(itemList.filter((item) => item.product_id !== id));
    },
    [itemList],
  );

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order.create")}
        breadcrumbList={[t("common.home"), t("order.management"), t("order.create")]}
      />
      <Toolbar />
      <OrderCreateForm addItem={addItem} />
      <OrderPreviewList list={itemList} deleteItem={deleteItem} />
    </>
  );
};

export default OrderCreatePage;
