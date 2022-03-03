import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import OrderCreateForm from "./OrderCreateForm";
import OrderPreviewList from "./OrderPreviewList";
import Toolbar from "./Toolbar";
import { t } from "i18next";
import { useCallback, useState } from "react";
import { OrderItemShow } from "apis/orderAPI";

const OrderCreatePage = function () {
  const title = `${t("turtlechain")} - ${t("order.create")}`;

  const [itemList, setItemList] = useState<Array<OrderItemShow>>([]);

  const addItem = useCallback((item: OrderItemShow) => {
    setItemList((itemList) => [...itemList, item]);
  }, []);

  const deleteItem = useCallback(
    (id) => {
      setItemList(itemList.filter((item) => item.product_id !== id));
    },
    [itemList],
  );

  const resetItemList = useCallback(() => {
    setItemList([]);
  }, []);

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order.create")}
        breadcrumbList={[t("common.home"), t("order.management"), t("order.create")]}
      />
      <OrderCreateForm addItem={addItem} />
      <OrderPreviewList list={itemList} deleteItem={deleteItem} resetList={resetItemList} />
    </>
  );
};

export default OrderCreatePage;
